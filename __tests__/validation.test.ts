import { z } from 'zod';

describe('Task Schema', () => {
  const taskSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).default('medium'),
    category: z.string().default('general'),
    dueDate: z.string().optional(),
    completed: z.boolean().default(false),
  });

  it('validates valid task data', () => {
    const result = taskSchema.safeParse({
      title: 'Test Task',
      priority: 'high',
      category: 'work',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty title', () => {
    const result = taskSchema.safeParse({ title: '' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid priority', () => {
    const result = taskSchema.safeParse({ title: 'Task', priority: 'invalid' });
    expect(result.success).toBe(false);
  });

  it('applies default priority', () => {
    const result = taskSchema.parse({ title: 'Task' });
    expect(result.priority).toBe('medium');
  });
});

describe('Register Schema', () => {
  const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string().min(2).optional(),
    adminSecret: z.string().optional(),
  });

  it('validates valid data', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });
    expect(result.success).toBe(true);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
  });
});