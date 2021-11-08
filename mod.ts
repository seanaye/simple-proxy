import { proxy } from "https://deno.land/x/oak_http_proxy@1.4.1/mod.ts";
import { Application } from "https://deno.land/x/oak@v6.5.0/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";

const args = parse(Deno.args)

if (!args.to || !args.port) {
  throw new Error(`Invalid cli args received. Expected values for --to and --port. Received: to:${args.to}, port:${args.port}`)
}

const app = new Application()

app.use(proxy(
  (ctx) => {
    console.log(ctx.request.url.pathname)
    return new URL(ctx.request.url.pathname, args.to)
  },
  {
    preserveHostHeader: true,
    memoizeUrl: false
  }
))
app.addEventListener("listen", ({ port }) => {
  console.log(`Proxy listening on port ${port}`)
  console.log(`Proxying requests to ${args.to}`)
})

app.listen({ port: +args.port })

