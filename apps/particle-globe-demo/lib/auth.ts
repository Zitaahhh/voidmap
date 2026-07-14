export type VoidMapUser = {
  id: string;
  username: string;
  createdAt: string;
};

type StoredVoidMapUser = VoidMapUser & {
  password: string;
};

const USERS_KEY = "voidmap:users";
const CURRENT_USER_KEY = "voidmap:current-user";

function canUseStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readUsers(): StoredVoidMapUser[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    const users = JSON.parse(raw) as StoredVoidMapUser[];
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredVoidMapUser[]) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function publicUser(user: StoredVoidMapUser): VoidMapUser {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  };
}

export function getCurrentUser(): VoidMapUser | null {
  if (!canUseStorage()) return null;

  try {
    const raw = window.localStorage.getItem(CURRENT_USER_KEY);
    return raw ? (JSON.parse(raw) as VoidMapUser) : null;
  } catch {
    return null;
  }
}

export function registerUser(username: string, password: string) {
  const normalizedUsername = username.trim();
  const normalizedPassword = password.trim();

  if (normalizedUsername.length < 2) {
    return { error: "用户名至少需要 2 个字符。", user: null };
  }

  if (normalizedPassword.length < 4) {
    return { error: "密码至少需要 4 个字符。", user: null };
  }

  const users = readUsers();
  const exists = users.some((user) => user.username.toLowerCase() === normalizedUsername.toLowerCase());
  if (exists) {
    return { error: "这个用户名已经被注册。", user: null };
  }

  const storedUser: StoredVoidMapUser = {
    id: `user-${Date.now()}`,
    username: normalizedUsername,
    password: normalizedPassword,
    createdAt: new Date().toISOString(),
  };

  writeUsers([...users, storedUser]);
  const user = publicUser(storedUser);
  setCurrentUser(user);
  return { error: null, user };
}

export function loginUser(username: string, password: string) {
  const normalizedUsername = username.trim();
  const normalizedPassword = password.trim();
  const matchedUser = readUsers().find(
    (user) => user.username.toLowerCase() === normalizedUsername.toLowerCase() && user.password === normalizedPassword,
  );

  if (!matchedUser) {
    return { error: "用户名或密码不正确。", user: null };
  }

  const user = publicUser(matchedUser);
  setCurrentUser(user);
  return { error: null, user };
}

export function setCurrentUser(user: VoidMapUser) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
}

export function logoutUser() {
  if (!canUseStorage()) return;
  window.localStorage.removeItem(CURRENT_USER_KEY);
}
