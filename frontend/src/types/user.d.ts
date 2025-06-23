// src/types/user.d.ts

export interface User {
  id: string; 
  name: string; 
  email: string; 
  ra: string; 
  role: 'admin' | 'user'; 
}