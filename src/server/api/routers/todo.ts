import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const todoRouter = createTRPCRouter({
  addTodo: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.create({
        data: {
          name: input.name,
          complete: false,
        },
      });
    }),

  todoList: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.todo.findMany();
  }),

  deleteTodo: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.todo.delete({
        where: {
          id: input.id,
        },
      });
    }),

  updateTodoStatus: protectedProcedure
    .input(z.object({ id: z.string(), complete: z.boolean() }))
    .mutation(({ ctx, input }) => {
      console.log('id, complete', input)
      return ctx.prisma.todo.update({
        where: {
          id: input.id,
        },
        data: {
          complete: input.complete,
        },
      });
    }),
});
