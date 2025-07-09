import { Arg, Authorized, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql'

import {
  Plan,
  PlanCreateInput,
  PlanUpdateInput,
} from '../entities/Plan'
import { AuthContextType, UserRole } from '../types'

@Resolver(Plan)
export class PlansResolver {
  @Query(() => [Plan])
  async plans(): Promise<Plan[]> {
    const plans = await Plan.find({
      order: { createdAt: 'DESC' },
    })
    return plans
  }

  @Query(() => Plan, { nullable: true })
  async plan(@Arg('id', () => Int) id: number): Promise<Plan | null> {
    const plan = await Plan.findOne({
      where: { id },
    })
    return plan
  }

  @Query(() => Plan, { nullable: true })
  async defaultPlan(): Promise<Plan | null> {
    const plan = await Plan.findOne({
      where: { isDefault: true },
    })
    return plan
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

      // If this plan is set as default, unset other default plans
      if (data.isDefault) {
        await Plan.update({ isDefault: true }, { isDefault: false })
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
    @Arg('id', () => Int) id: number,
    @Arg('data', () => PlanUpdateInput) data: PlanUpdateInput,
  ): Promise<Plan | null> {
    try {
      const plan = await Plan.findOne({
        where: { id },
      })
      if (!plan) {
        throw new Error('Plan not found')
      }

      // Check for duplicate name if name is being updated
      if (data.name && data.name !== plan.name) {
        const existingPlan = await Plan.findOne({
          where: { name: data.name },
        })
        if (existingPlan) {
          throw new Error('A plan with this name already exists')
        }
      }

      // If this plan is being set as default, unset other default plans
      if (data.isDefault === true) {
        await Plan.update({ isDefault: true }, { isDefault: false })
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
  async deletePlan(@Arg('id', () => Int) id: number): Promise<boolean> {
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