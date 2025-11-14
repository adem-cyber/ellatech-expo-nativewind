import React, { useState } from "react";
import { User } from "../types.ts";

interface UserManagementProps {
  users: User[];
  onRegisterUser: (fullName: string, email: string) => void;
}

interface UserRegistrationFormProps {
  onRegisterUser: (fullName: string, email: string) => void;
}

const UserRegistrationForm = ({
  onRegisterUser,
}: UserRegistrationFormProps) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) {
      setError("Both fields are required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    onRegisterUser(fullName, email);
    setFullName("");
    setEmail("");
    setError("");
  };

  const inputClasses =
    "block w-full rounded-lg border border-slate-300 px-3 py-2.5 transition focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200";

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Register New User
      </h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
      >
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className={`${inputClasses} md:col-span-1`}
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputClasses} md:col-span-1`}
        />
        <button
          type="submit"
          className="bg-violet-600 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-violet-700 transition duration-300 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500"
        >
          Register User
        </button>
      </form>
    </div>
  );
};

interface UserListProps {
  users: User[];
}

const UserList = ({ users }: UserListProps) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm">
      <h2 className="text-lg font-bold text-slate-800 mb-4">
        Registered Users
      </h2>
      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 border border-slate-200 rounded-lg bg-slate-50/50 flex items-start space-x-4"
            >
              <div className="flex-shrink-0 h-10 w-10 bg-violet-200 text-violet-700 rounded-full flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 truncate">
                  {user.fullName}
                </p>
                <p className="text-sm text-slate-500 truncate">{user.email}</p>
                <p className="text-xs text-slate-400 mt-1">
                  Joined: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-slate-500">
          <div className="flex flex-col items-center justify-center">
            <svg
              className="w-12 h-12 text-slate-400 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.664v.005z"
              />
            </svg>
            <h3 className="text-lg font-medium text-slate-700">
              No Users Found
            </h3>
            <p className="text-sm">Register a new user to see them here.</p>
          </div>
        </div>
      )}
    </div>
  );
};

const UserManagement = ({ users, onRegisterUser }: UserManagementProps) => {
  return (
    <div className="space-y-8">
      <UserRegistrationForm onRegisterUser={onRegisterUser} />
      <UserList users={users} />
    </div>
  );
};

export default UserManagement;
