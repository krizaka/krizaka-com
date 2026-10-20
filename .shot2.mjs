import {chromium} from 'playwright';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto(process.argv[2],{waitUntil:'networkidle'});
for (let y=0;y<9000;y+=400){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(150);}
const n=await p.locator('.pv-live-value').count();console.log('count',n);
const el=p.locator('.pv-live-value').first();await el.scrollIntoViewIfNeeded();await p.waitForTimeout(800);
console.log(await el.evaluate(v=>{const out=[];v.querySelectorAll('*').forEach(n=>{const c=getComputedStyle(n);out.push(n.className+' fs='+c.fontSize+' '+c.fontFamily.slice(0,14)+' tnum='+c.fontVariantNumeric+' w='+n.getBoundingClientRect().width.toFixed(1))});return out.join('\n')}));
await el.screenshot({path:process.argv[3]});await b.close();
