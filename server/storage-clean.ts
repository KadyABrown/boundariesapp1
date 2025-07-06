import { db } from "./db";
import { 
  personalBaselines, 
  relationships, 
  interactions, 
  boundaryGoals,
  users,
  InsertPersonalBaseline,
  InsertRelationship,
  InsertInteraction,
  InsertBoundaryGoal,
  PersonalBaseline,
  Relationship,
  Interaction,
  BoundaryGoal
} from "../shared/schema";
import { eq, and, desc } from "drizzle-orm";

export class Storage {
  
  // Personal Baseline Methods
  async createBaseline(userId: string, data: InsertPersonalBaseline): Promise<PersonalBaseline> {
    const [baseline] = await db.insert(personalBaselines).values({
      userId,
      ...data
    }).returning();
    
    // Auto-generate boundary goals from baseline
    await this.generateBoundaryGoalsFromBaseline(userId, data);
    
    return baseline;
  }

  async getLatestBaseline(userId: string): Promise<PersonalBaseline | null> {
    const baseline = await db.select()
      .from(personalBaselines)
      .where(eq(personalBaselines.userId, userId))
      .orderBy(desc(personalBaselines.version))
      .limit(1);
    
    return baseline[0] || null;
  }

  async updateBaseline(userId: string, id: number, data: Partial<InsertPersonalBaseline>): Promise<PersonalBaseline> {
    const [baseline] = await db.update(personalBaselines)
      .set(data)
      .where(and(eq(personalBaselines.id, id), eq(personalBaselines.userId, userId)))
      .returning();
    
    return baseline;
  }

  // Relationship Methods
  async createRelationship(userId: string, data: InsertRelationship): Promise<Relationship> {
    const [relationship] = await db.insert(relationships).values({
      userId,
      ...data
    }).returning();
    
    return relationship;
  }

  async getRelationships(userId: string): Promise<Relationship[]> {
    return await db.select()
      .from(relationships)
      .where(eq(relationships.userId, userId))
      .orderBy(desc(relationships.createdAt));
  }

  async getRelationship(userId: string, id: number): Promise<Relationship | null> {
    const relationship = await db.select()
      .from(relationships)
      .where(and(eq(relationships.id, id), eq(relationships.userId, userId)))
      .limit(1);
    
    return relationship[0] || null;
  }

  async updateRelationship(userId: string, id: number, data: Partial<InsertRelationship>): Promise<Relationship> {
    const [relationship] = await db.update(relationships)
      .set(data)
      .where(and(eq(relationships.id, id), eq(relationships.userId, userId)))
      .returning();
    
    return relationship;
  }

  async deleteRelationship(userId: string, id: number): Promise<boolean> {
    const result = await db.delete(relationships)
      .where(and(eq(relationships.id, id), eq(relationships.userId, userId)));
    
    return result.rowCount > 0;
  }

  // Interaction Methods (CIT)
  async createInteraction(userId: string, data: InsertInteraction): Promise<Interaction> {
    const [interaction] = await db.insert(interactions).values({
      userId,
      ...data
    }).returning();
    
    return interaction;
  }

  async getInteractionsForRelationship(userId: string, relationshipId: number): Promise<Interaction[]> {
    return await db.select()
      .from(interactions)
      .where(and(
        eq(interactions.userId, userId),
        eq(interactions.relationshipId, relationshipId)
      ))
      .orderBy(desc(interactions.createdAt));
  }

  async getAllInteractions(userId: string): Promise<Interaction[]> {
    return await db.select()
      .from(interactions)
      .where(eq(interactions.userId, userId))
      .orderBy(desc(interactions.createdAt));
  }

  // Boundary Goals Methods
  async createBoundaryGoal(userId: string, data: InsertBoundaryGoal): Promise<BoundaryGoal> {
    const [goal] = await db.insert(boundaryGoals).values({
      userId,
      ...data
    }).returning();
    
    return goal;
  }

  async getBoundaryGoals(userId: string): Promise<BoundaryGoal[]> {
    return await db.select()
      .from(boundaryGoals)
      .where(eq(boundaryGoals.userId, userId))
      .orderBy(desc(boundaryGoals.createdAt));
  }

  // Auto-generate boundary goals from baseline assessment
  private async generateBoundaryGoalsFromBaseline(userId: string, baseline: InsertPersonalBaseline): Promise<void> {
    const goals: InsertBoundaryGoal[] = [];

    // Generate goals from non-negotiable boundaries
    if (baseline.nonNegotiableBoundaries) {
      for (const boundary of baseline.nonNegotiableBoundaries) {
        goals.push({
          boundaryName: boundary,
          description: `Non-negotiable boundary from baseline assessment`,
          isFromBaseline: true,
          targetRespectRate: 95, // High target for non-negotiables
          isActive: true
        });
      }
    }

    // Generate goals from triggers
    if (baseline.triggers) {
      for (const trigger of baseline.triggers) {
        goals.push({
          boundaryName: `Avoid ${trigger}`,
          description: `Boundary to avoid personal trigger: ${trigger}`,
          isFromBaseline: true,
          targetRespectRate: 80,
          isActive: true
        });
      }
    }

    // Generate goal for personal space needs
    if (baseline.personalSpaceNeeds) {
      goals.push({
        boundaryName: `${baseline.personalSpaceNeeds} personal space`,
        description: `Maintaining ${baseline.personalSpaceNeeds} level of personal space`,
        isFromBaseline: true,
        targetRespectRate: 85,
        isActive: true
      });
    }

    // Insert all goals
    if (goals.length > 0) {
      await db.insert(boundaryGoals).values(
        goals.map(goal => ({ userId, ...goal }))
      );
    }
  }

  // Analytics Methods
  async getRelationshipHealthScore(userId: string, relationshipId: number): Promise<number> {
    const interactions = await this.getInteractionsForRelationship(userId, relationshipId);
    const baseline = await this.getLatestBaseline(userId);
    
    if (!interactions.length || !baseline) return 50; // Default neutral score
    
    let totalScore = 0;
    let count = 0;
    
    for (const interaction of interactions) {
      if (interaction.preEnergyLevel && interaction.postEnergyLevel) {
        const energyDiff = interaction.postEnergyLevel - interaction.preEnergyLevel;
        const anxietyDiff = (interaction.preAnxietyLevel || 5) - (interaction.postAnxietyLevel || 5);
        const selfWorthDiff = (interaction.postSelfWorth || 5) - (interaction.preSelfWorth || 5);
        
        // Calculate score based on improvements
        const interactionScore = 50 + (energyDiff * 5) + (anxietyDiff * 3) + (selfWorthDiff * 4);
        totalScore += Math.max(0, Math.min(100, interactionScore));
        count++;
      }
    }
    
    return count > 0 ? Math.round(totalScore / count) : 50;
  }

  async getBoundaryViolationRate(userId: string, boundaryName: string): Promise<number> {
    const allInteractions = await this.getAllInteractions(userId);
    
    let totalChecks = 0;
    let violations = 0;
    
    for (const interaction of allInteractions) {
      if (interaction.boundariesViolated?.includes(boundaryName)) {
        violations++;
        totalChecks++;
      } else if (interaction.boundariesRespected?.includes(boundaryName)) {
        totalChecks++;
      }
    }
    
    return totalChecks > 0 ? Math.round((violations / totalChecks) * 100) : 0;
  }
}

export const storage = new Storage();