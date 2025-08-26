import { Arg, Authorized, ID, Mutation, Query, Resolver } from 'type-graphql'

import { Plan, PlanCreateInput, PlanUpdateInput } from '../entities/Plan'
import { UserRole } from '../types'

@Resolver(Plan)
export class PlansResolver {
  @Query(() => [Plan])
  async plans(): Promise<Plan[]> {
    const plans = await Plan.find({
      order: { price: 'ASC' },
    })
    return plans
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => Plan)
  async createPlan(
    @Arg('data', () => PlanCreateInput) data: PlanCreateInput,
  ): Promise<Plan> {
    try {
      // Verify if plan with same name already exists
      const existingPlan = await Plan.findOne({
        where: { name: data.name },
      })

      if (existingPlan) {
        throw new Error('A plan with this name already exists')
      }

      const newPlan = new Plan()
      Object.assign(newPlan, data)

      const createdPlan = await newPlan.save()
      return createdPlan
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => Plan)
  async updatePlan(
    @Arg('id', () => ID) id: string,
    @Arg('data', () => PlanUpdateInput) data: PlanUpdateInput,
  ): Promise<Plan> {
    try {
      const plan = await Plan.findOne({
        where: { id },
      })
      if (!plan) {
        throw new Error('Plan not found')
      }

      Object.assign(plan, data)
      const updatedPlan = await plan.save()
      return updatedPlan
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : JSON.stringify(err))
    }
  }

  /* Delete plan: when a plan is deleted, all subscriptions associated with it are also deleted => 
    we shouldn't delete plans but only update
  */
}
