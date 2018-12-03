# Creating a RESTful API with Node.js
This repository accompanies my YouTube video series on building a RESTful API with Node.js: [https://www.youtube.com/playlist?list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q](https://www.youtube.com/playlist?list=PL55RiY5tL51q4D-B63KBnygU6opNPFk_q)

## Usage
Check out the branch you're interested in (i.e. which belongs to the video in my series you just watched), ```git clone``` it and thereafter run ```npm install```.

nếu sử dụng ssr, bạn dùng cookie thì request sẽ đi kèm cookie luôn
Tuy nhiên nếu dùng SPA cụ thể ở đây mình dùng react thì request đầu server sẽ trả về js, html, css. Sau đó ở componentWillMount ta chèn token ở localStorage hoặc cookie rồi gửi lên server là ok
 Bạn có thể sài params, querystring, header.
Cookie bản chất cũng là header, nhưng cookie thì trình duyệt tự gửi lên. Nên sài cookie thì ko cần chạy đến đoạn code của mình code. Ngoài ra cookie còn có option SSL, httponly, expire.
Nếu ko sài cookie thì phải cho chạy đoạn code js nào đó phía client rồi gửi lên server, lúc này server mới check đc.
Ví dụ: nếu bạn vào trang home, nếu muốn check token này hợp lệ hay không thì render đoạn js xuống client, tiếp đoạn client sẽ truyền lên token (lưu trong local storage chẳng hạn), thì lúc này server mới check đc. Phương pháp này sài cho dạng webapp thì ok, còn sài cho web thường thì phải tốn đến 2 request mới check đc, ngoài ra phải render đoạn html, js để gửi lên nữa thì sẽ phức tạp hơn. Nếu sài cookie, thì trình duyệt tự gửi, lần request đầu tiên server đã check đc token hợp lệ hay ko
secret là để nó kí tên và đóng dấu cái cookie. Khi request dc gởi lên server, thì server dựa vào secret này kiểm tra, nếu chữ kí hợp lệ thì ngon, chạy tiếp, nếu ko, xin chúc mừng có ai đó đã giả mạo chữ kí của bạn, chọi cái status 403 vô mặt nó hoặc 500 internal server error cho nó biết khó mà bỏ đi hack website khác.

resave bằng true, thì cứ hết request là nó sẽ save session vào store, cho dù là session ko có thay đổi gì nó cũng save.

saveUninitialized: là khi user vào web, là nó sinh ra session ngay cho user mà ko cần qua xác thực, lúc này session dc khởi tạo nhưng chả có giá trị gì, nếu saveUninitialized mà true thì nó cũng dc save xuống store luôn. cho tốn thêm bộ nhớ !
------------------------------------------
Theo thứ tự là express session > passport session > flash > router. Bạn test riêng cái flash xem work chưa đã
-----------------------------------------------------
Ồ em vừa test rùi nhá.. quả như dự tính.. em view code thấy passport chỉ hủy session.passport của nó thui nhé anh... các session mà anh lưu trữ thêm ở ngoài thì anh bắt buộc phải dùng destroy này rồi :D .. Vì vậy nếu dùng xác thực bằng passport thì sau khi req.logout() .. phải thêm cả req.session.destroy() nữa anh
--------------------------------------------------
// GET /logout
router.get('/logout', function(req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});
----------------------------------------------------------
Bạn thắc mắc là làm sao điều khiển được thời gian sống của session? Ví dụ cho vào giỏ 10 ngày sau mở web lên vẫn còn thì bạn có thể set thời gian sống của cookie chứa sessionId của phiên đó. hết thời gian sống -> hết access -> sau đó xóa dưới server đi hay giữ lại là tùy bạn.
=---------------------------------------------------------------------------------
 lưu thằng cái userID vào trong socket được mà khi authenticate xong thì socket.userID = xxxx. Còn ta thấy là 1 user sẽ có nhiều socketId còn 1 socketId chỉ có 1 user mà thôi => nhét cái userid:[list socketId] vào redis