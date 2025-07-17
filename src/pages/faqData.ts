export const FAQ_CATEGORIES = [
  {
    id: 'luggage',
    name: 'Hành lí',
    icon: '🧳',
    faqs: [
      {
        q: 'Hành lí xách tay được quy định như thế nào?',
        a: 'Mỗi hành khách được mang 1 kiện hành lý xách tay miễn cước, tối đa 20 kg, kích thước không vượt quá 0,8 m × 0,5 m × 0,4 m (thể tích ≤ 0,16 m³). Nếu vượt quá giới hạn này, hành khách cần ký gửi và có thể phải trả phí.\nVới hành lý ký gửi:\n – Tối thiểu tính 5 kg/kiện\n – Phần lẻ từ 0,5 kg trở lên được làm tròn thành 1 kg\n – Hàng cồng kềnh tính 1 m³ = 300 kg\n – Xe đạp và xe máy được áp dụng bảng phí riêng'
      },
      {
        q: 'Tôi có thể để hành lý xách tay ở đâu trong toa tàu?',
        a: 'Khoang giường nằm:\n – Kệ trên giường tầng 3: để được vali 20–24″\n – Gầm giường tầng 1 (cao khoảng 28 cm): vừa vali 24–26″\nKhoang ghế ngồi:\n – Có kệ ngang kéo dài giống như trên máy bay\n – Không giới hạn chiều dài, nhưng giới hạn chiều cao khoảng 35 cm\n – Phù hợp với vali cabin, ba lô\n – Không để hành lý lớn dưới chân hoặc trong hành lang\nNếu hệ thống phát hiện hành lý quá cỡ so với khoang bạn chọn, sẽ hiện cảnh báo yêu cầu đổi khoang hoặc ký gửi.'
      },
      {
        q: 'Nếu tôi mang 3 vali 28″ nhưng lại đặt ghế ngồi thì sao?',
        a: 'Ghế ngồi không có đủ chỗ chứa cho nhiều vali cỡ lớn. Trong quá trình đặt vé, hệ thống sẽ hiện cảnh báo. Bạn nên chuyển sang khoang giường nằm hoặc đăng ký ký gửi hành lý trước chuyến đi.'
      },
      {
        q: 'Những vật phẩm nào bị cấm mang lên tàu?',
        a: '– Vũ khí, chất nổ hoặc các chất dễ cháy\n – Động vật sống (trừ thú cưng đã đăng ký theo quy định)\n – Hàng hóa có mùi khó chịu hoặc dễ bị rò rỉ'
      },
      {
        q: 'Kích thước hành lí như thế nào sẽ bị tính là hàng cồng kềnh?',
        a: 'Bất cứ hành lí nào có kích thước vượt mức giới hạn của hành lí xách tay hoặc nằm ngoài thể loại được quy định của hành lí xách tay đều được xem là hàng cồng kềnh. Hàng cồng kềnh cần phải được khai báo kí gửi có phí tại trang https://duongsatthongnhat.com/bao-gia-van-dich-vu-chuyen-hang-hoa-bang-duong-sat/'
      }
    ]
  },
  {
    id: 'pets',
    name: 'Thú cưng và vật nuôi',
    icon: '🐶',
    faqs: [
      {
        q: 'Tôi có được mang thú cưng lên tàu không?',
        a: 'Chỉ được mang thú cưng nhỏ (mèo, chó dưới 10 kg) nếu đã đặt trước và tuân thủ quy định.'
      },
      {
        q: 'Thú cưng cần đi trong điều kiện gì?',
        a: 'Phải được nhốt trong lồng kín, sạch sẽ, không gây mùi hoặc tiếng ồn.'
      },
      {
        q: 'Tôi có cần trả thêm phí cho thú cưng không?',
        a: 'Không. Thú cưng nhỏ (mèo/chó dưới 10 kg) nếu đã đăng ký trước sẽ không phải trả thêm phí nhưng phải đảm bảo điều kiện về lồng và giấy tờ.'
      }
    ]
  },
  {
    id: 'time',
    name: 'Thời gian & thủ tục trước giờ tàu chạy',
    icon: '⏰',
    faqs: [
      {
        q: 'Tôi nên có mặt ở ga trước bao lâu?',
        a: 'Nên đến trước ít nhất 30 phút để kiểm tra vé và tìm toa.'
      },
      {
        q: 'Tôi có cần in vé giấy không?',
        a: 'Không cần. Mã QR hoặc mã đặt vé trên điện thoại là đủ để lên tàu.'
      },
      {
        q: 'Tôi có thể đổi hoặc huỷ vé không?',
        a: 'Được, nếu còn thời gian quy định. Phí đổi/hủy tùy thuộc vào loại vé và thời điểm yêu cầu.'
      }
    ]
  },
  {
    id: 'seat',
    name: 'Ghế ngồi và khoang giường nằm',
    icon: '🛏️',
    faqs: [
      {
        q: 'Tôi có được chọn tầng giường khi đặt vé không?',
        a: 'Có. Hệ thống cho phép chọn tầng giường nếu khoang còn trống.'
      },
      {
        q: 'Giường tầng 1, 2, 3 có khác nhau không?',
        a: 'Có. DSVN hiện có hai loại khoang giường phổ biến: khoang 4 giường (2 tầng) và khoang 6 giường (3 tầng). Sự khác nhau giữa các tầng thể hiện ở: độ cao trần, độ rộng leo lên, vị trí ổ điện, và độ tiện nghi tổng thể.\nKích thước giường:\nKhoang 4 giường (ANL): 80 × 190 cm\nKhoang 6 giường (BNL): 78 × 190 cm\nĐộ cao tầng giường:\nTầng 1 → Tầng 2: ~72–75 cm\nTầng 2 → Tầng 3: ~65 cm\nKhoảng trần tầng 3: rất thấp, chỉ khoảng 50–55 cm, phải cúi thấp người khi lên xuống và không thể ngồi thẳng lưng với người cao trên 1m60.\nTầng 1 là rộng rãi và dễ di chuyển nhất, đặc biệt phù hợp người cao tuổi.\nĐể hình dung: bình nước lavie 20L cao 58 cm, người có thể ngồi thẳng ở tầng 1, hơi khom lưng ở tầng 2, và phải bò khi vào tầng 3.'
      },
      {
        q: 'Ghế nào phù hợp cho người lớn tuổi?',
        a: 'Nên chọn khoang giường tầng 1 hoặc ghế mềm loại rộng. Có thể báo nhân viên hỗ trợ trước.'
      }
    ]
  },
  {
    id: 'service',
    name: 'Tiện nghi & dịch vụ trên tàu',
    icon: '🚆',
    faqs: [
      {
        q: 'Trên tàu có ổ sạc điện thoại/laptop không?',
        a: 'Không có ổ điện cá nhân tại từng giường. Ổ cắm (thường là ổ đơn) được đặt ở đầu toa, phía trên cửa ra vào khoang. Hành khách tầng 1 cần trèo lên nếu muốn sử dụng.\nĐối với các tàu mới như tàu SE29, SE21/22 thì mỗi giường được trang bị ổ sạc USB ngay đầu giường kèm đèn đọc sách.'
      },
      {
        q: 'Tàu có wifi hoặc sóng điện thoại không?',
        a: 'Không có wifi. Sóng điện thoại phụ thuộc khu vực; một số đoạn đèo hoặc hầm sẽ mất sóng.'
      },
      {
        q: 'Có phục vụ ăn uống trên tàu không?',
        a: 'Có. Một số tuyến dài có bán suất ăn và nước uống. Bạn cũng có thể mang theo đồ riêng.'
      }
    ]
  },
  {
    id: 'hygiene',
    name: 'Vệ sinh, thực phẩm và an toàn',
    icon: '🧼',
    faqs: [
      {
        q: 'Trên tàu có nhà vệ sinh không?',
        a: 'Có. Mỗi toa đều có nhà vệ sinh cơ bản, được vệ sinh định kỳ.'
      },
      {
        q: 'Tôi có được mang thức ăn riêng lên tàu không?',
        a: 'Được. Tuy nhiên nên tránh mang thực phẩm nặng mùi hoặc dễ đổ vỡ.'
      },
      {
        q: 'Có giới hạn gì về đồ dễ vỡ không?',
        a: 'Không cấm, nhưng bạn tự chịu trách nhiệm nếu làm rơi hoặc vỡ trong hành trình.'
      }
    ]
  },
  {
    id: 'support',
    name: 'Hỗ trợ đặc biệt cho hành khách yếu thế',
    icon: '♿',
    faqs: [
      {
        q: 'Người cao tuổi hoặc trẻ em có được hỗ trợ gì không?',
        a: 'Có thể yêu cầu nhân viên hỗ trợ khi lên/xuống tàu nếu báo trước tại quầy vé hoặc hotline.'
      },
      {
        q: 'Tôi có thể yêu cầu giúp khuân vác hành lý không?',
        a: 'Chỉ áp dụng tại một số ga lớn. Vui lòng hỏi trước để được hướng dẫn cụ thể.'
      },
      {
        q: 'Tôi là người khuyết tật, nên làm gì để được hỗ trợ?',
        a: 'Vui lòng liên hệ tổng đài hoặc nhân viên quầy vé ít nhất 24 giờ trước giờ tàu chạy để được bố trí phù hợp.'
      }
    ]
  }
]; 