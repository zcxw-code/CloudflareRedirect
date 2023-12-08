export default {
  async fetch(request, env, ctx) {
    const default_redirect = "about:blank"; // only url
    const someHost = "https://someHost.com"; // url 
    const regex = /^\/?[0-9a-zA-Z]{8}$/;
    const onUrl = new URL(request.url);
    const url = new URL(someHost + onUrl.pathname);
    const status_path = 'm/status'
    if (onUrl.pathname.endsWith(status_path)){
      return new Response(`<body style="background: #fffff0;font-size: 100px;text-align: center;/* text-align-last: center; */position:fixed;top: 50%;bottom: 0;left: 0;right: 0;width: -webkit-fill-available;height: -webkit-fill-available;" class="i-ua_narrow">🤡</body>`, new Response("", { status: 200, headers: {"content-type": "text/html;charset=UTF-8"}}))

    }
    if (request.method != "GET") {

      return new Response("Error 405: Method not allowed", new Response("", { status: 405 }))
    }
    


    const checkOnTag = function () {
      return regex.test(onUrl.pathname)
    }
    const redirect = function (to) {
      return new Response(`<script>window.location.href = "${to}"</script>`, new Response("", { status: 301, headers: {"content-type": "text/html;charset=UTF-8"}}))
      // new Response("", { status: 301, headers: {"location": to}}))
    }
    async function gatherResponse(response) {
      const { headers } = response;
      const contentType = headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        var to = await response.json();
        if (to['to'] == 'url' || to['to'] == undefined) {
          return default_redirect
        }
        return to['to']



      } else {
        return default_redirect
      }

    }

    if (!checkOnTag()) {
      return redirect(default_redirect)
    }
    console.log(...request.headers)
    const response = await fetch(url, {
      headers: {
        "user-agent": String(request.headers.get('user-agent')) + " | IP: " + String(request.headers.get('x-real-ip')) ,
      }
    });

    const results = await gatherResponse(response);
    return redirect(results)
  },
};
