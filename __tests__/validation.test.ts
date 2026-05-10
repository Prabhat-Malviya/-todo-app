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

  it('applies default priority to medium', () => {
    const result = taskSchema.parse({ title: 'Task' });
    expect(result.priority).toBe('medium');
  });

  it('accepts all valid priorities', () => {
    const priorities = ['low', 'medium', 'high'];
    priorities.forEach((p) => {
      const result = taskSchema.safeParse({ title: 'Task', priority: p });
      expect(result.success).toBe(true);
    });
  });

  it('applies default category to general', () => {
    const result = taskSchema.parse({ title: 'Task' });
    expect(result.category).toBe('general');
  });

  it('applies default completed to false', () => {
    const result = taskSchema.parse({ title: 'Task' });
    expect(result.completed).toBe(false);
  });

  it('accepts optional description', () => {
    const result = taskSchema.safeParse({
      title: 'Task',
      description: 'Some description',
    });
    expect(result.success).toBe(true);
  });

  it('accepts optional dueDate', () => {
    const result = taskSchema.safeParse({
      title: 'Task',
      dueDate: '2024-12-31',
    });
    expect(result.success).toBe(true);
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

  it('rejects invalid email format', () => {
    const result = registerSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects email without domain', () => {
    const result = registerSchema.safeParse({
      email: 'test@',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects email without @', () => {
    const result = registerSchema.safeParse({
      email: 'testexample.com',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects short password (less than 6 chars)', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: '12345',
    });
    expect(result.success).toBe(false);
  });

  it('accepts exactly 6 character password', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: '123456',
    });
    expect(result.success).toBe(true);
  });

  it('accepts optional admin secret', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
      adminSecret: 'admin123',
    });
    expect(result.success).toBe(true);
  });

  it('accepts valid email formats', () => {
    const emails = ['user@test.com', 'user.name@test.com', 'user+tag@test.com'];
    emails.forEach((email) => {
      const result = registerSchema.safeParse({ email, password: 'password123' });
      expect(result.success).toBe(true);
    });
  });
});

describe('Auth Scenarios', () => {
  const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
  });

  it('validates login with email and password', () => {
    const result = loginSchema.safeParse({
      email: 'user@test.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects login without email', () => {
    const result = loginSchema.safeParse({
      email: '',
      password: 'password123',
    });
    expect(result.success).toBe(false);
  });

  it('rejects login without password', () => {
    const result = loginSchema.safeParse({
      email: 'user@test.com',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});

describe('Task Update Schema', () => {
  const updateSchema = z.object({
    title: z.string().min(1).optional(),
    description: z.string().optional(),
    priority: z.enum(['low', 'medium', 'high']).optional(),
    category: z.string().optional(),
    dueDate: z.string().nullable().optional(),
    completed: z.boolean().optional(),
  });

  it('allows partial update with just title', () => {
    const result = updateSchema.safeParse({ title: 'Updated Task' });
    expect(result.success).toBe(true);
  });

  it('allows partial update with just completed', () => {
    const result = updateSchema.safeParse({ completed: true });
    expect(result.success).toBe(true);
  });

  it('allows full update', () => {
    const result = updateSchema.safeParse({
      title: 'Updated Task',
      description: 'New description',
      priority: 'high',
      category: 'work',
      completed: true,
    });
    expect(result.success).toBe(true);
  });

  it('allows null dueDate', () => {
    const result = updateSchema.safeParse({ dueDate: null });
    expect(result.success).toBe(true);
  });
});

describe('Edge Cases', () => {
  it('handles unicode in task title', () => {
    const schema = z.object({ title: z.string().min(1) });
    const result = schema.safeParse({ title: 'タスク' });
    expect(result.success).toBe(true);
  });

  it('handles special characters in password', () => {
    const schema = z.object({ password: z.string().min(6) });
    const result = schema.safeParse({ password: 'pass@#$%^' });
    expect(result.success).toBe(true);
  });

  it('handles long task title', () => {
    const schema = z.object({ title: z.string().min(1) });
    const result = schema.safeParse({ title: 'a'.repeat(1000) });
    expect(result.success).toBe(true);
  });
});