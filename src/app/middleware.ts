import { NextRequest, NextResponse } from "next/server";
import Personalize from "@contentstack/personalize-edge-sdk";

export const config = {
  matcher: ["/events", "/events/:path*"],
};

export default async function middleware(req: NextRequest) {
  const projectUid = process.env.NEXT_PUBLIC_CONTENTSTACK_P13N_PROJECT_ID!;
  const region = process.env.NEXT_PUBLIC_CONTENTSTACK_REGION;

  const edgeApiUrl =
    region === "EU"
      ? "https://eu-personalize-edge.contentstack.com"
      : "https://personalize-edge.contentstack.com";

  Personalize.setEdgeApiUrl(edgeApiUrl);
  await Personalize.init(projectUid, { request: req });

  const variantParam = Personalize.getVariantParam();
  const url = req.nextUrl.clone();

  if (variantParam) {
    url.searchParams.set(
      Personalize.VARIANT_QUERY_PARAM,
      variantParam
    );
  }

  const response = NextResponse.rewrite(url);
  await Personalize.addStateToResponse(response);

  return response;
}
