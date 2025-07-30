"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Paper,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useMyInfo } from "@/api/hooks";
import { apiClient } from "@/api/client";
import {
  MyInfoResponseRoleEnum,
  PendingShop,
  ApproveRequest,
  ApproveRequestApproveEnum,
} from "@/api/generated";

const AdminPage = () => {
  const router = useRouter();
  const { data: myInfo } = useMyInfo();
  const [pendingShops, setPendingShops] = useState<PendingShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<PendingShop | null>(null);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  // 관리자 권한 확인
  const isAdmin = myInfo?.data?.role === MyInfoResponseRoleEnum.Admin;

  // 관리자가 아닌 경우 메인 페이지로 리다이렉트
  useEffect(() => {
    if (myInfo && !isAdmin) {
      router.push("/");
    }
  }, [myInfo, isAdmin, router]);

  // 승인 대기 중인 식당 목록 가져오기
  const fetchPendingShops = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getPendingShop1();
      if (response.data?.data?.pendingShopList) {
        setPendingShops(response.data.data.pendingShopList);
      }
    } catch (err) {
      console.error("승인 대기 식당 목록 조회 실패:", err);
      setError("승인 대기 식당 목록을 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchPendingShops();
    }
  }, [isAdmin]);

  // 승인/거절 처리
  const handleApprove = async (
    shopId: number,
    approve: ApproveRequestApproveEnum
  ) => {
    try {
      setProcessing(true);
      const approveRequest: ApproveRequest = {
        approve: approve,
      };

      await apiClient.getPendingShop(shopId, approveRequest);

      // 성공 후 목록 새로고침
      await fetchPendingShops();

      // 다이얼로그 닫기
      setApproveDialogOpen(false);
      setRejectDialogOpen(false);
      setSelectedShop(null);
    } catch (err) {
      console.error("승인/거절 처리 실패:", err);
      setError("처리 중 오류가 발생했습니다.");
    } finally {
      setProcessing(false);
    }
  };

  // 승인 상태에 따른 칩 색상
  const getStatusChip = (approve: string | undefined) => {
    switch (approve) {
      case "PENDING":
        return <Chip label="대기중" color="warning" size="small" />;
      case "APPROVED":
        return <Chip label="승인됨" color="success" size="small" />;
      case "REJECTED":
        return <Chip label="거절됨" color="error" size="small" />;
      default:
        return <Chip label="대기중" color="warning" size="small" />;
    }
  };

  if (!isAdmin) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        관리자 페이지
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        식당 등록 승인 관리
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              승인 대기 중인 식당 ({pendingShops.length}개)
            </Typography>
            <Button
              variant="outlined"
              onClick={fetchPendingShops}
              disabled={loading}
            >
              새로고침
            </Button>
          </Box>

          {pendingShops.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                승인 대기 중인 식당이 없습니다.
              </Typography>
            </Paper>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {pendingShops.map((shop) => (
                <Card key={shop.shopId}>
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6" component="h2">
                        {shop.shopName}
                      </Typography>
                      {getStatusChip(shop.approve)}
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong>신청자:</strong> {shop.userName}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      <strong>주소:</strong> {shop.address}
                    </Typography>

                    {shop.detailAddress && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        <strong>상세주소:</strong> {shop.detailAddress}
                      </Typography>
                    )}

                    {shop.tel && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        gutterBottom
                      >
                        <strong>전화번호:</strong> {shop.tel}
                      </Typography>
                    )}

                    {shop.approve === "PENDING" && (
                      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          onClick={() => {
                            setSelectedShop(shop);
                            setApproveDialogOpen(true);
                          }}
                        >
                          승인
                        </Button>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => {
                            setSelectedShop(shop);
                            setRejectDialogOpen(true);
                          }}
                        >
                          거절
                        </Button>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </>
      )}

      {/* 승인 확인 다이얼로그 */}
      <Dialog
        open={approveDialogOpen}
        onClose={() => setApproveDialogOpen(false)}
      >
        <DialogTitle>식당 승인</DialogTitle>
        <DialogContent>
          <Typography>
            "{selectedShop?.shopName}" 식당을 승인하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setApproveDialogOpen(false)}
            disabled={processing}
          >
            취소
          </Button>
          <Button
            onClick={() =>
              selectedShop &&
              handleApprove(
                selectedShop.shopId!,
                ApproveRequestApproveEnum.Approved
              )
            }
            color="success"
            variant="contained"
            disabled={processing}
          >
            {processing ? <CircularProgress size={20} /> : "승인"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* 거절 확인 다이얼로그 */}
      <Dialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
      >
        <DialogTitle>식당 거절</DialogTitle>
        <DialogContent>
          <Typography>
            "{selectedShop?.shopName}" 식당을 거절하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setRejectDialogOpen(false)}
            disabled={processing}
          >
            취소
          </Button>
          <Button
            onClick={() =>
              selectedShop &&
              handleApprove(
                selectedShop.shopId!,
                ApproveRequestApproveEnum.Rejected
              )
            }
            color="error"
            variant="contained"
            disabled={processing}
          >
            {processing ? <CircularProgress size={20} /> : "거절"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminPage;
