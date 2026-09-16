import { USERS } from "../../data/users";
import { AppUser } from "../../types/user";
import { cloneData, simulateRequest } from "./mockClient";

let users: AppUser[] = cloneData(USERS);

export const userService = {
  list(): Promise<AppUser[]> {
    return simulateRequest(cloneData(users));
  },
  update(id: string, patch: Partial<AppUser>): Promise<AppUser> {
    const idx = users.findIndex((u) => u.id === id);
    if (idx === -1) return simulateRequest(null as never, { failWith: "User not found" });
    users[idx] = { ...users[idx], ...patch };
    return simulateRequest(cloneData(users[idx]));
  },
};
