"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { createStorageRequest, StorageRequestData } from "@/app/actions/storage-request"
import { ReloadIcon } from "@radix-ui/react-icons"

interface StorageRequestModalProps {
  isOpen: boolean
  onClose: () => void
}

export function StorageRequestModal({ isOpen, onClose }: StorageRequestModalProps) {
  const [email, setEmail] = useState("")
  const [imageCode, setImageCode] = useState("")
  const [reason, setReason] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email?.trim() || !imageCode?.trim() || !reason?.trim()) {
      toast({
        title: "Lỗi Xác Thực",
        description: "Vui lòng điền đầy đủ các trường bắt buộc.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const requestData: StorageRequestData = {
        email: email.trim(),
        imageCode: imageCode.trim(),
        reason: reason.trim(),
      }

      const result = await createStorageRequest(requestData)

      if (result?.success) {
        toast({
          title: "Đã Gửi Yêu Cầu",
          description: "Yêu cầu lưu trữ mã ảnh của bạn đã được gửi thành công.",
        })
        setEmail("")
        setImageCode("")
        setReason("")
        onClose()
      } else {
        throw new Error(result?.error || "Có lỗi xảy ra khi gửi yêu cầu")
      }
    } catch (err: unknown) {
      console.error('Lỗi khi gửi yêu cầu:', err)
      toast({
        title: "Lỗi",
        description: err instanceof Error ? err.message : "Không thể gửi yêu cầu. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="sm:max-w-[425px]"
        onEscapeKeyDown={onClose}
        onInteractOutside={(e) => {
          if (isSubmitting) {
            e.preventDefault()
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>Yêu Cầu Lưu Trữ Mã Ảnh</DialogTitle>
          <DialogDescription>
            Gửi yêu cầu lưu trữ mã ảnh mới hoặc yêu cầu tìm kiếm mã ảnh bị thiếu. Chúng tôi sẽ xem xét và phản hồi qua email.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Liên Hệ</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
              aria-describedby="email-description"
            />
            <p id="email-description" className="text-sm text-muted-foreground">
              Email để chúng tôi phản hồi kết quả tìm kiếm hoặc lưu trữ mã ảnh của bạn.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageCode">Mã Ảnh Cần Lưu Trữ</Label>
            <Input
              id="imageCode"
              type="text"
              placeholder="Nhập mã ảnh (VD: S-12345)"
              value={imageCode}
              onChange={(e) => setImageCode(e.target.value)}
              required
              disabled={isSubmitting}
              aria-describedby="code-description"
            />
            <p id="code-description" className="text-sm text-muted-foreground">
              Nhập mã ảnh bạn muốn chúng tôi lưu trữ hoặc tìm kiếm.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Chi Tiết Yêu Cầu</Label>
            <Textarea
              id="reason"
              placeholder="Mô tả thêm về yêu cầu của bạn (nguồn ảnh, thông tin thêm...)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              disabled={isSubmitting}
              className="min-h-[100px] resize-y"
              aria-describedby="reason-description"
            />
            <p id="reason-description" className="text-sm text-muted-foreground">
              Cung cấp thêm thông tin về mã ảnh và lý do yêu cầu để chúng tôi hỗ trợ tốt hơn.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy Bỏ
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                  Đang Xử Lý...
                </>
              ) : (
                "Gửi Yêu Cầu"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}