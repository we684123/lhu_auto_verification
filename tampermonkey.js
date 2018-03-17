// ==UserScript==
// @name         auto_verification
// @version      0.9
// @description  auto_key_verification
// @author       we684123
// @match        https://eportal.lhu.edu.tw/index.do?*
// @match        https://eportal.lhu.edu.tw/login.do
// @grant        GM_xmlhttpRequest
// @namespace    none
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @run-at       document-end
// @domain       https://script.google.com/
// ==/UserScript==

//=============================================================================
(function() {
  //以下設定用
  var account = ""; //選填，預設為空，你的龍華【帳號】，沒填不會幫忙輸入
  var password = ""; //選填，預設為空，你的龍華【密碼】，沒填不會幫忙輸入
  var identity = ""; //選填，預設為空，你的【提供用戶】身分碼(取得身分碼網址)
  var auto_login = false; //選填，預設為true，要不要自動按下 "登入"   (登入首頁)
  var auto_next = true; //選填，預設為true，要不要自動按下 "下一步" (gmail確認)
  var auto_check = true; //選填，預設為true，要不要自動按下 "確認"   (登入失敗頁面)
  var reslog = true; //選填，預設為false，載入回應log?  //目前無用
  //以上填完就好囉---------------------------------------------------

  //位置定義
  var login_page = "eportal.lhu.edu.tw/index.do";
  var input_account = document.getElementsByTagName('input')[0] ;
  var input_password = document.getElementsByTagName('input')[1] ;
  var input_verification = document.getElementById("authcode") ;
  var verification_image = document.getElementsByTagName('img')[1] ;
  var login_button = document.getElementsByTagName('input')[3];
  var server_url = "https://script.google.com/macros/s/AKfycbxAzS75EtzljCtbvJ6l8EyQQISJmUIJ_V7gBHZh_BZ1BMEv_lvt/exec";

  //=============================================================================
  if (String(location.href).search(login_page) > 1) {
    //alert('030//');
    var img = verification_image;
    var imgbase64 = getBase64Image(img);
    console.log(imgbase64);

    //之所以有下面這行這麼醜是因為gs傲嬌，搞成json居然不吃，只好字串處理了
    var post_data = identity + "~" + String(imgbase64);
    console.log(post_data);
    //==========================================================================
    GM_xmlhttpRequest({ //post
      method: "POST",
      url: server_url,
      data: post_data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(response) {
        //console.log (response.responseText);
        console.log("get response");
        try {
          var ans = JSON.parse(response.responseText)["return"];
          //====================================================================
          if (ans == "-1") {
            ans = "無資源，請自行輸入";
          } else if (ans.length == 3) { //vision有時候會失誤，就當盡量救。
            var ans2 = "I" + ans;
          } else {
            ans2 = ans;
          }
          console.log("ans = ");
          console.log(ans);
          if (account) {
            input_account.value = account;
          }
          if (password) {
            input_password.value = password;
          }
        } catch (e) {
            console.log("error text:");
            console.log(e);
        }
        console.log("end print");
        if (ans != "請自行輸入") {
          input_verification.value = ans2;
        }
        if (auto_login) {
          login_button.click();
        }
      }
    });
  } else if (String(location.href).search('eportal.lhu.edu.tw/login.do') > 1) {
    //這是如果有跳轉頁面的話才需要的，所以這裡就不模組化了。
    try {
      if (auto_next) { //自動"下一步"
        document.getElementsByTagName('a')[0].click();
      }
    } catch (e) {
      if (auto_check) { //自動點"確認"
        document.getElementsByTagName('button')[0].click();
      }
    }
  } else {
    console.log("唉呀呀...失手了030....");
  }
  //alert('030 end //');
})();
//=============================================================================
function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");

  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}
