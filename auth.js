import {check_pwd} from '../actions/userActions'
import API from 'fetch-api';
import {restapi,poolspath,diskspath,volumespath,agentspath,userspath,username,password} from '../confs/host'


module.exports = {
  username : 'admin',
  password : 'Aa123456',
  login(loginName, pass, cb) {
    //cb = arguments[arguments.length - 1]
    if (sessionStorage.token) {
      if (cb) cb(true)
      this.onChange(true)
      return
    }


    /*if (loginName === 'admin' && pass === 'Aa123456') {
      cb({
        authenticated: true,
        token: Math.random().toString(36).substring(7)
      })
    } else {
      cb({ authenticated: false })
    }*/
    pretendRequest(loginName, pass, (res) => {
      if (res.flag == "success") {
        sessionStorage.token = res.user.token.token
        if (cb) cb(true)
        this.onChange(loginName,pass)
        sessionStorage.user = JSON.stringify(res.user);
      } else {
        if (cb) cb(false)
        //this.onChange(false)
      }
    })
  },

  getToken: function () {
    return sessionStorage.token
  },

  logout: function (cb) {
    delete sessionStorage.token
    delete sessionStorage.user
    if (cb) cb()
    this.onChange(false)
    window.location.reload();
  },

  loggedIn: function () {
    return !!sessionStorage.token
  },

  onChange: function (loginName,pass) {
      this.username = loginName,
      this.password = pass
  }
}

function pretendRequest(loginName, pass, cb) {
  const params = { 'baseURI': restapi, 'path': userspath };
  let api = new API({
    baseURI: params.baseURI
  });
  // log in to our API with a user/pass
  api.auth([loginName, pass]);
  api.get(params.path+'?limit='+new Date().getTime(), {
    credentials: 'include',
    mode: 'cors',
    headers: { 'Accept': 'application/json' }
  }, (err, res, body) => {
    if (err) {
      console.log('err', err)
      cb({flag:'error',message:'网络连接或用户名或密码错误，请重新再试!'});
      return false
    }
    let currentU = null;
    const len = body.results ? body.results.length : 0;
    for(let i=0;i<len;i++){
      const u = body.results[i];
      if(u.username == loginName){
        currentU = u;
        break;
      }
    }
    if(currentU){
      cb({flag:'success',message:'',user:currentU});
    }else{
      cb({flag:'error',message:'用户名或密码错误，请重新再试!'});
    }
  })
}
