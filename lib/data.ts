import fs from 'node:fs/promises';import path from 'node:path';import type {Product,AccessRequest,Order} from './types';
const dataDir=path.join(process.cwd(),'data');
async function readJson<T>(file:string,fallback:T):Promise<T>{try{return JSON.parse(await fs.readFile(path.join(dataDir,file),'utf8')) as T}catch{return fallback}}
async function writeJson<T>(file:string,data:T){await fs.mkdir(dataDir,{recursive:true});await fs.writeFile(path.join(dataDir,file),JSON.stringify(data,null,2),'utf8')}
export async function getProducts(all=false){const products=await readJson<Product[]>('products.json',[]);return all?products:products.filter(p=>p.published)}
export async function getProduct(slug:string){return (await getProducts(true)).find(p=>p.slug===slug)}
export async function saveProducts(products:Product[]){await writeJson('products.json',products)}
export async function getAccessRequests(){return readJson<AccessRequest[]>('access.json',[])}
export async function addAccessRequest(r:Omit<AccessRequest,'id'|'createdAt'>){const list=await getAccessRequests();const item={...r,id:crypto.randomUUID(),createdAt:new Date().toISOString()};list.unshift(item);await writeJson('access.json',list);return item}
export async function getOrders(){return readJson<Order[]>('orders.json',[])}
export async function addOrder(r:Omit<Order,'id'|'createdAt'|'status'>){const list=await getOrders();const item={...r,id:crypto.randomUUID(),createdAt:new Date().toISOString(),status:'Pending concierge review'};list.unshift(item);await writeJson('orders.json',list);return item}
export const img={hero:'/images/a_dark_high_end_luxury_website_hero_scene_with_a.png',feature:'/images/a_sleek_high_end_product_webpage_or_magazine_styl.png',collection:'/images/a_dark_luxury_e_commerce_website_ui_mockup_galle.png',trust:'/images/a_dark_luxury_website_landing_page_scene_high_end.png',about:'/images/a_high_end_dark_luxury_website_about_page_layout.png',access:'/images/a_sleek_high_end_minimalistic_website_landing_he.png',account:'/images/a_dark_high_end_web_ui_dashboard_account_page_s.png',checkout:'/images/a_dark_luxury_e_commerce_checkout_ui_screenshot_o.png',legal:'/images/a_dark_minimalist_website_page_screenshot_mocku.png',void:'/images/a_moody_minimal_cinematic_abstract_scene_a_dark.png'}
export const money=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n)
