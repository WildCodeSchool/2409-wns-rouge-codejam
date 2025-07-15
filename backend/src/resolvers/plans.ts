import { Arg, Authorized, ID, Mutation, Query, Resolver } from 'type-graphql'

import {
  Plan,
  PlanCreateInput,
  PlanUpdateInput,
} from '../entities/Plan'
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
  @Mutation(() => Plan, { nullable: true })
  async createPlan(
    @Arg('data', () => PlanCreateInput) data: PlanCreateInput,
  ): Promise<Plan | null> {
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
  @Mutation(() => Plan, { nullable: true })
  async updatePlan(
    @Arg('id', () => ID) id: string,
    @Arg('data', () => PlanUpdateInput) data: PlanUpdateInput,
  ): Promise<Plan | null> {
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
      throw new Error((err as Error).message)
    }
  }

  @Authorized(UserRole.ADMIN)
  @Mutation(() => Boolean)
  async deletePlan(@Arg('id', () => ID) id: string): Promise<boolean> {
    try {
      const plan = await Plan.findOne({
        where: { id },
        relations: ['subscriptions'],
      })
      if (!plan) {
        throw new Error('Plan not found')
      }

      // Check if plan has active subscriptions
      if (plan.subscriptions && plan.subscriptions.length > 0) {
        throw new Error('Cannot delete a plan that has active subscriptions')
      }

      await plan.remove()
      return true
    } catch (err) {
      throw new Error((err as Error).message)
    }
  }
} 