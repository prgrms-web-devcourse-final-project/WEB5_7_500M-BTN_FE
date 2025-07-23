import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/api/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentKey, orderId, amount } = body;

    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: "필수 파라미터가 누락되었습니다." },
        { status: 400 }
      );
    }

    // 백엔드 API를 통해 결제 확인
    const response = await apiClient.confirm({
      paymentKey,
      orderId,
      amount,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("결제 확인 실패:", error);

    if (error.response?.data) {
      return NextResponse.json(
        { error: error.response.data.message || "결제 확인에 실패했습니다." },
        { status: error.response.status || 500 }
      );
    }

    return NextResponse.json(
      { error: "결제 확인 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
