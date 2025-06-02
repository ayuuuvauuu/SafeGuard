// Mock authentication service to replace Firebase

// Mock user type
export interface User {
  uid: string
  email: string
  name: string
  role: "Protector" | "Protected"
}

// Mock user store
const users = [
  {
    uid: "user1",
    email: "female@example.com",
    password: "password",
    name: "Jane Doe",
    role: "To be Protected" as const,
  },
  {
    uid: "user2",
    email: "male@example.com",
    password: "password",
    name: "John Doe",
    role: "Protector" as const,
  },
]

// Current user state
let currentUser: User | null = null

// Mock sign in function
export async function signIn(email: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const user = users.find((u) => u.email === email && u.password === password)

      if (user) {
        // Create a user object without the password
        const { password, ...userWithoutPassword } = user
        currentUser = userWithoutPassword
        resolve(userWithoutPassword)
      } else {
        reject(new Error("Invalid email or password"))
      }
    }, 1000)
  })
}

// Mock sign up function
export async function signUp(email: string, password: string, name: string, gender: string): Promise<User> {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Check if user already exists
      if (users.some((u) => u.email === email)) {
        reject(new Error("User already exists"))
        return
      }

      // Create new user
      const role = gender === "Male" ? "Protector" : "Protected"
      const newUser = {
        uid: `user${users.length + 1}`,
        email,
        password,
        name,
        role,
      }

      // Add to users array
      users.push(newUser)

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser
      currentUser = userWithoutPassword
      resolve(userWithoutPassword)
    }, 1000)
  })
}

// Mock sign out function
export async function signOut(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentUser = null
      resolve()
    }, 500)
  })
}

// Get current user
export function getCurrentUser(): User | null {
  return currentUser
}
