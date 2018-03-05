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
  var reslog = true; //選填，預設為false，載入回應log?
  //以上填完就好囉---------------------------------------------------

  //=============================================================================
  if (String(location.href).search('eportal.lhu.edu.tw/index.do') > 1) {
    //alert('030//');
    var img = document.getElementsByTagName('img')[1];
    var imgbase64 = getBase64Image(img);
    console.log(imgbase64);
    var post_data = identity + "~" + String(imgbase64);
    console.log(post_data);
    //==========================================================================
    GM_xmlhttpRequest({ //post
      method: "POST",
      url: "https://script.google.com/macros/s/AKfycbxAzS75EtzljCtbvJ6l8EyQQISJmUIJ_V7gBHZh_BZ1BMEv_lvt/exec",
      data: post_data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      onload: function(response) {
        //console.log (response.responseText);
        console.log("get response");
        var st = "終末";
        var ed = "之地";
        try {
          var tx2 = String(response.responseText);
          var a = tx2.search(st);
          var aa = st.length;
          var r = tx2.length;
          var g = tx2.substring(a, r);
          var b = g.search(ed);
          var ans = g.substring(aa, b);
          //====================================================================
          if (ans == "-1") {
            ans = "請自行輸入";
          } else if (ans.length == 3) { //vision有時候會失誤
            var ans2 = "I" + ans;
          } else {
            ans2 = ans;
          }
          console.log("ans = ");
          console.log(ans);
          if (account) {
            document.getElementsByTagName('input')[0].value = account;
          }
          if (password) {
            document.getElementsByTagName('input')[1].value = password;
          }
        } catch (e) {
          console.log(e);
        }
        if (reslog) {
          console.log(tx2);
        }
        console.log("end print");
        if (ans != "請自行輸入") {
          document.getElementById("authcode").value = ans2;
        }
        if (auto_login) {
          document.getElementsByTagName('input')[3].click();
        }
      }
    });
  } else if (String(location.href).search('eportal.lhu.edu.tw/login.do') > 1) {
    try {
      if (auto_next) { //自動"下一步"
        document.getElementsByTagName('img')[0].click();
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
