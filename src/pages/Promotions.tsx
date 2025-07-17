import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { 
  Percent, 
  Clock, 
  ArrowLeft, 
  Gift, 
  Star,
  Zap,
  Heart,
  TrendingUp,
  CreditCard
} from "lucide-react";

const promotions = [
  {
    id: "promo1",
    label: "Giảm 50k",
    description: "Đơn hàng tối thiểu 2.5 triệu",
    expiry: "HSD: 23:59 • T3, 15/07",
    icon: Percent,
    iconColor: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    tag: "DÀNH CHO BẠN",
    tagColor: "bg-blue-500",
    info: true,
    discount: "50k",
  },
  {
    id: "promo2",
    label: "Giảm 80k",
    description: "Đơn hàng tối thiểu 4 triệu",
    expiry: "HSD: 23:59 • T3, 15/07",
    icon: Gift,
    iconColor: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    tag: "DÀNH CHO BẠN",
    tagColor: "bg-blue-500",
    info: true,
    discount: "80k",
  },
  {
    id: "promo3",
    label: "Giảm 15k",
    description: "Đơn hàng tối thiểu 800k",
    expiry: "HSD: 23:59 • T3, 15/07",
    icon: Star,
    iconColor: "text-yellow-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    tag: "DÀNH CHO BẠN",
    tagColor: "bg-blue-500",
    info: true,
    discount: "15k",
  },
  {
    id: "promo4",
    label: "Giảm 20%, tối đa 60k",
    description: "Đơn hàng không giới hạn số lượng vé",
    expiry: "HSD: 23:59 • T2, 30/06",
    icon: CreditCard,
    iconColor: "text-green-500",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    tag: "THANH TOÁN",
    tagColor: "bg-green-500",
    info: true,
    discount: "20%",
  },
  {
    id: "promo5",
    label: "Giảm 30k cho sinh viên",
    description: "Áp dụng cho sinh viên có thẻ sinh viên hợp lệ",
    expiry: "HSD: 23:59 • T5, 20/07",
    icon: TrendingUp,
    iconColor: "text-indigo-500",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
    tag: "SINH VIÊN",
    tagColor: "bg-indigo-500",
    info: true,
    discount: "30k",
  },
  {
    id: "promo6",
    label: "Giảm 25k cho người cao tuổi",
    description: "Áp dụng cho người từ 60 tuổi trở lên",
    expiry: "HSD: 23:59 • T6, 25/07",
    icon: Heart,
    iconColor: "text-pink-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    tag: "NGƯỜI CAO TUỔI",
    tagColor: "bg-pink-500",
    info: true,
    discount: "25k",
  },
];

const Promotions = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f7f7fa] z-0">
      <div className="bg-white w-[360px] h-[800px] relative shadow-xl rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="w-full bg-[#2563d6] text-white px-4 pt-5 pb-3 flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-2 p-1 rounded-lg hover:bg-white hover:bg-opacity-20 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="text-base font-semibold">Ưu đãi của bạn</span>
        </div>
        
        {/* Content */}
        <div className="flex-1 w-full px-3 pt-3 pb-2 overflow-y-auto">
          {promotions.map((promo) => {
            const IconComponent = promo.icon;
            return (
              <Card 
                key={promo.id} 
                className={`mb-3 border-2 ${promo.borderColor} rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer`}
              >
                <CardContent className="flex flex-row items-center gap-3 p-4">
                  {/* Icon Container */}
                  <div className={`w-16 h-16 ${promo.bgColor} rounded-xl flex items-center justify-center relative`}>
                    <IconComponent size={28} className={promo.iconColor} />
                    {/* Discount Badge */}
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                      {promo.discount}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[10px] font-bold text-white uppercase tracking-wide px-1.5 py-0.5 rounded-full ${promo.tagColor}`}>
                        {promo.tag}
                      </span>
                      {/* Đã loại bỏ icon Info */}
                    </div>
                    <div className="font-bold text-base mb-1 text-gray-800">{promo.label}</div>
                    <div className="text-xs text-gray-600 mb-1">{promo.description}</div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} />
                      {promo.expiry}
                    </div>
                  </div>
                  
                  {/* Action Button */}
                  <Button 
                    size="sm" 
                    className="bg-[#2563d6] hover:bg-[#1d4ed8] text-white px-3 py-1 text-xs font-medium rounded-lg"
                  >
                    Sử dụng
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          
          {/* Empty State */}
          <div className="text-center py-8 text-gray-500">
            <Zap size={48} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm">Không có ưu đãi nào khác</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promotions; 