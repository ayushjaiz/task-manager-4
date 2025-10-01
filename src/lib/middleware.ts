import { NextRequest, NextResponse } from "next/server";
import {
  verifyToken,
  getTokenFromRequest,
  getTokenFromCookies,
  JWTPayload,
} from "./auth";

type AuthHandler = (
  request: NextRequest,
  ...args: unknown[]
) => Promise<NextResponse>;

export function withAuth(handler: AuthHandler) {
  return async (
    request: NextRequest,
    ...args: unknown[]
  ): Promise<NextResponse> => {
    try {
      const token =
        getTokenFromRequest(request) || getTokenFromCookies(request);

      if (!token) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      const payload = verifyToken(token);
      if (!payload) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      // Add user info to request
      (request as NextRequest & { user: JWTPayload }).user = payload;

      return handler(request, ...args);
    } catch {
      return NextResponse.json(
        { error: "Authentication failed" },
        { status: 401 }
      );
    }
  };
}
