1. Trang chào mừng đến với dsvn  
2. Đăng nhập, đăng kí như thường (add nút skip cho những người test prototype)  
3. Hiện ra trang để input basic data khi mua vé tàu:

![][image1]

4. Trong trang này:  
- Nơi xuất phát và ga đến có thanh search (AI thông minh để tự đổi ví dụ HCM thành Sài Gòn, mở ngoặc tên sau khi sáp nhập)  
- Ngày đi và khứ hồi dùng nút như hình, dùng date range, mờ những ngày đã qua và bôi đậm ngày hôm nay, có hiện lịch âm, có hiển thị số ngày đếm được trong date range  
- Thêm một dòng cho khai báo hành lí: xách tay, cồng kềnh, thú cưng,... Mỗi loại có một dấu chấm hỏi nhỏ mờ đi cùng ở sau để khi ấn vào sẽ hiện thông tin cụ thể về loại hàng hoá. Cụ thể:  
+ Xách tay: “hành lí xách tay có tiêu chuẩn phải dưới x kích thước và y khối lượng. Bấm vào đây để xem những nơi có thể để hành lí xách tay của bạn trong khoang giường nằm/ghế ngồi”. Khi hành khách ấn vào sẽ dẫn ra trang FAQ, dẫn thẳng tới câu hỏi cùng nội dung, và câu trả lời đã có sẵn hình chụp thật những vị trí đó cùng mặt cắt sơ đồ 2d ở ngăn trên tầng 3, gầm giường tầng 1, hành lang giữa các khoang. Nếu không vừa (ví dụ chọn 3 vali to mà chọn ghế ngồi) → cảnh báo: “Hành lý của bạn có thể gây cản trở lối đi. Bạn nên chọn khoang giường hoặc đăng ký gửi hành lý.”  
+ Cồng kềnh: “hành lí cồng kềnh phải được đăng kí riêng. Vui lòng ấn vào đây để chuyển sang trang đăng kí hàng cồng kềnh.”   
+ Thú cưng: loại thú, trọng lượng,... thêm dấu quy định của thú cưng như dấu chấm than.  
- Hành khách 5 loại như hình, nhảy từ dưới lên trang cụ thể hành khách:  
+ Đối với trẻ em (0-10 tuổi), nếu chọn trẻ em mà không chọn người lớn nào → hệ thống không cho tiếp tục và hiện cảnh báo: “Trẻ em phải đi cùng người lớn. Vui lòng thêm ít nhất 1 người lớn.” Trẻ dưới 6 tuổi có thể được miễn phí vé khi sử dụng chung chỗ với người lớn (tối đa 1 người lớn được kèm 2 bé miễn phí). Nếu đã chọn thêm ghế cho trẻ thì trẻ có thể ngồi riêng 1 ghế và không giới hạn số trẻ em. Tuy nhiên nên thêm cảnh báo nếu chỉ có 1 người lớn và quá 3 trẻ: “Để đảm bảo an toàn cho trẻ, 1 người lớn chỉ nên kèm 3 trẻ em. Hãy chú ý đến các bé và thêm người lớn nếu có thể.”    
+ Đối với nhóm: Nếu chọn 4 người → hệ thống gợi ý: Những khoang còn trống 4 giường liền nhau, hoặc 4 ghế gần nhau. Nếu số người không vừa khoang → hệ thống cảnh báo trước: “Không còn khoang 4 giường trống đủ cho nhóm. Bạn có muốn chia thành 2 phòng liền kề không?”

   ![][image2]

5. Sau khi bấm tìm kiếm sẽ hiện ra list tàu, giữ nguyên dòng các ngày cùng mức giá rẻ nhất của những ngày đó như hình dưới. Thay vì hiện mặc định theo giờ tàu chạy, nút sắp xếp nên được hiển thị rõ ràng hơn, và hiển thị chi tiết rằng đang sắp xếp theo giờ tàu chạy. Đồng thời, **tàu hiển thị đầu tiên** không phải là tàu sớm nhất mà là tàu được **hệ thống logic ngầm phân loại** để đưa tàu phù hợp nhất lên trên cùng, bôi vàng, gọi là **“tàu được gợi ý cho bạn”**. Tàu đó sẽ phù hợp nhất theo các thông tin basic mà họ đã nhập ở bước trên.   
   Ví dụ: hành khách: người cao tuổi (số lượng 01):  
   1. Cần giường thấp (tầng 1\)  
   2. Di chuyển chậm → Không phù hợp tàu dừng ít (thời gian dừng tại ga ngắn)  
   3. Cần yên tĩnh → thuộc nhóm “quiet”  
   4. Hay đi vệ sinh → vị trí gần nhà vệ sinh (không phải tầng 3\)  
      Khuyến nghị:  
   5. Thêm flag “elderly mode” để system tự detect & ưu tiên đề xuất các cabin tầng 1, gần nhà vệ sinh (kết quả này sẽ hiển thị cho bộ lọc lần 2)  
   6. Nên tránh tàu dừng quá nhanh ở các ga (nếu thời gian dừng dưới 2 phút → khó trở tay)  
   7. Ưu tiên tàu có cơ sở vật chất tốt để tránh sốc

Ví dụ recommendation logic theo data basic đầu vào để gợi ý tàu cho từng loại hành khách:

| Đối tượng chọn từ đầu | Gợi ý các tàu |  |
| ----- | ----- | ----- |
| Người cao tuổi | Tàu còn nhiều tầng thấp \+ cơ sở vật chất mới \+ nhiều ga dừng lâu |  |
| Sinh viên | Tàu giá rẻ \+ tầng cao (rẻ hơn) |  |
| Nhóm đi đông | Toa còn trống nhiều ghế/giường liền kề |  |
| Người có trẻ em | Tàu còn nhiều tầng thấp \+ ưu tiên xếp vào khoang có sẵn các gia đình khác |  |

![][image3]

Ngay sau khi nhấn “Tìm kiếm”, app hiển thị ra tàu gợi ý đầu tiên: “Tàu phù hợp nhất với bạn” (có icon, nổi bật hơn các dòng tàu còn lại). Dưới đó là lý do: “Bạn có trẻ em đi cùng → Tàu SE4 có khoang giường tầng 1, đến Nha Trang lúc 7h sáng.” Thêm nút: Có thể chọn hoặc bỏ qua gợi ý này và xem danh sách các tàu còn lại.

6. **Detail tàu:**   
- Nên luôn highlight các tàu đang có ưu đãi hoặc giá rẻ nhất, kèm 1 tag bên cạnh chuyến tàu đó (giống như tag chất lượng cao trong ảnh)

  ![][image4]

- Chia màu trực quan: tàu trong list sẽ theo màu này (kèm gì đó để chú thích cho list màu)  
    • Xanh lá \= tàu chạy xuyên suốt (ưu tiên, ít trễ)  
    • Cam \= tàu chậm hơn (nhường đường)  
    • Xám \= tàu ít phổ biến (ít người đặt, cơ sở vật chất kém)  
- Hiển thị thông tin bổ sung theo tab hoặc tooltip  
    • Một dòng ngắn gọn bên cạnh mỗi chuyến tàu: *“Dừng 12 ga, 8 tiếng 30 phút, có 3 toa nâng cấp 2023, ghế mềm, điều hòa 2 chiều”*  
    • Kèm nút **\[Xem chi tiết\]**, mở ra:   
     – Tỷ lệ delay trung bình của tàu, liệt kê tất cả các ga tàu sẽ dừng, thể hiện số phút dừng thực tế tại mỗi ga, thêm icon đại diện cho tiện ích: 🍱 Nhà ăn, 🛁 Nhà vệ sinh, 🛒 Kiosk và tiện ích hỗ trợ  
     – Thông tin về độ mới của cơ sở vật chất  
     – Bản đồ hành trình (dừng bao nhiêu ga), Mức độ ồn: dùng historical feedback kết hợp vị trí kỹ thuật của toa (gần máy kéo, gần quạt gió) → Hoặc đơn giản: Toa cuối thường ồn hơn, toa gần đầu máy ít rung hơn  
- 


7. **Chỉ giữ lại bộ lọc và sắp xếp** để lọc và sắp xếp các chuyến tàu theo yêu cầu. Trong hai chức năng đó sẽ có các tiêu chí nhất định nói ở mục số 8 và 9\.  
8. BỘ LỌC LẦN 1:

| Tiêu chí | Mục đích | Cách thể hiện |
| ----- | ----- | ----- |
| **Giờ đến mong muốn** | Đảm bảo đúng lịch trình (công tác, sự kiện…) | Khung giờ mong muốn đến nơi (ví dụ: 6h–9h sáng) |
| **Khoảng giá mong muốn** | Phù hợp ngân sách | Kéo thanh trượt như airbnb |
| **Thời gian khởi hành** | Phù hợp giờ rảnh (tối, đêm, sáng…) | Lăn kéo như báo thức iphone |
| **Hành vi mong muốn** | Quiet / Social  | Tick chọn hành vi để hệ thống suggest tàu có nhiều khách cùng nhóm, không tick vẫn được. Kèm hiển thị tooltip: “Khách thường phàn nàn khi vào khu ồn ào không mong muốn. Chọn đúng mức độ ồn giúp tránh xung đột hành vi và tăng sự hài lòng chuyến đi.” Đối với khách là những người đặt sớm nên dẫn đến có những tàu trống hoàn toàn, chưa có ai là social hay quiet: “chưa đủ dữ liệu hành vi, lọc tạm thời theo cấu trúc tàu” |
| **Loại ghế/giường mong muốn** | Tránh tàu không có khoang mình cần | Chọn sẵn “Ghế ngồi”, “Khoang 4”, “Khoang 6” |

9. Sau khi bộ lọc được xác nhận, list tàu sẽ lập tức thay đổi theo kết quả bộ lọc  
10. Nút sắp xếp cho list tàu:  
    Hiển thị “Sắp xếp theo: \[Tiêu chí\] \- \[từ trên xuống/dưới lên\]. Các tiêu chí:  
- Tổng thời gian hành trình  
- Tàu ít dừng hoặc ít delay, ít phải nhường (tàu ưu tiên)  
- Giờ khởi hành   
- Giá  
11. Sau khi sắp xếp được xác nhận, list tàu sẽ lập tức thay đổi theo kết quả các tiêu chí sắp xếp  
12. Sau khi có được kết quả cả 2: bộ lọc và sắp xếp, khách sẽ chọn được chuyến tàu mong muốn. Sau khi vào giao diện cụ thể của chuyến tàu, khách sẽ phải chọn chỗ ngồi ưng ý. Lúc này sẽ áp dụng bộ lọc lần 2\.  
    BỘ LỌC LẦN 2:

### 

| Hành vi mong muốn | Quiet / Social | Tick chọn, app tự bôi xanh vùng chỗ phù hợp |
| :---- | :---- | :---- |
| **Vị trí tầng (1/2/3)** | Người già cần tầng 1, trẻ thích tầng 3 | Tick chọn tầng hoặc mô phỏng sơ đồ 3D |
| **Khoảng giá** | Ưu tiên vị trí giá mềm |  |
| **Vẽ wc hai đầu** | Tránh ồn, tránh mùi | Cho biết vị trí tương đối trên sơ đồ |
| **Có sẵn người cùng hành vi gần đó** | Quiet thì yên tâm hơn nếu xung quanh cùng Quiet | App hiển thị icon người đã chọn gần đó (ẩn danh) |

13. Sau khi biết được chỗ nào hợp ý \=\> bấm chọn. Trong thời gian bấm chọn sẽ diễn ra:  
- Hiển thị đồng hồ đếm ngược “giữ chỗ tạm thời”: Khi khách chọn chỗ → hệ thống **tự động giữ chỗ trong 10 phút**  
- Góc màn hình hiện: “⏳ Ghế A23 đã được giữ. Vui lòng hoàn tất thanh toán trong 10:00 phút”  
- Khi còn 1 phút, hiện cảnh báo: “⚠️ Ghế sẽ được mở lại cho người khác trong 1 phút nữa”  
14. Khi chỗ bị mất vì người khác đặt trước → Thông báo lý do cụ thể: “Chỗ B14 vừa được một hành khách khác thanh toán thành công. Vui lòng chọn chỗ khác.” \=\> Điều này **xoa dịu cảm giác mất kiểm soát** và tạo niềm tin vào tính minh bạch của hệ thống.  
- Ngay trong màn hình thanh toán: “💡 Bạn có thể đổi chỗ/hoàn vé trước giờ tàu 24 tiếng – xem chính sách”  
- 👥 Đối với nhóm khách:  
+ Nếu hệ thống phát hiện hành khách chọn \>1 ghế liên tục → sẽ giữ chỗ **cả cụm trong 10 phút**  
+ Đồng hồ đếm ngược nhóm hiện rõ: “Bạn đang giữ 4 chỗ liền kề. Vui lòng hoàn tất thanh toán trước 09:45”  
15. Bỏ Sau khi thanh toán thành công, nếu khách có hàng cồng kềnh đặt ở toa chở hàng \=\> hướng dẫn họ đường đi để từ toa họ nằm/ngồi sang lấy hàng cồng kềnh của họ  
      
16. Sau khi  lên để xin kết thúc hành trình, push noti xin review. Review xong được tích điểm. Điểm đó để quy đổi mã giảm giá \=\> END JOURNEY

