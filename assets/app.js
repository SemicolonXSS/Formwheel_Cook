const defs=[
["물","💧","liquid"],["스파게티 면","🍝","pasta"],["사과","🍎","fruit"],["양송이 버섯","🍄","veg"],["다진 마늘","🧄","season"],["바비큐 소스","🥫","sauce"],["난","🫓","bread"],["양념된 고기","🥩","meat"],["모짜렐라","🧀","cheese"],["양파","🧅","veg"],["파프리카","🫑","veg"],["브라우니 믹스","🍫","mix"],["콘옥수수","🌽","veg"],["투게더 아이스크림","🍨","icecream"],["토마토 소스","🍅","sauce"],["베이컨","🥓","meat"],
["마늘", "🧄", "veg"],
["달걀", "🥚", "egg"],
["우유", "🥛", "liquid"],
["버터", "🧈", "fat"],
["체다 치즈", "🧀", "cheese"],
["감자", "🥔", "veg"],
["당근", "🥕", "veg"],
["브로콜리", "🥦", "veg"],
["시금치", "🥬", "veg"],
["양배추", "🥬", "veg"],
["오이", "🥒", "veg"],
["토마토", "🍅", "veg"],
["대파", "🌱", "veg"],
["닭고기", "🍗", "meat"],
["소시지", "🌭", "meat"],
["새우", "🦐", "seafood"],
["참치 통조림", "🐟", "ready"],
["밥", "🍚", "ready"],
["식빵", "🍞", "bread"],
["또띠아", "🫓", "bread"],
["바나나", "🍌", "fruit"],
["딸기", "🍓", "fruit"],
["초콜릿", "🍫", "sweet"],
["꿀", "🍯", "sweet"],
["간장", "🥫", "season"],
["소금", "🧂", "season"],
["후추","🌶️","season"],["올리브유","🫒","fat"],["식용유","🫗","fat"],["설탕","🍬","sweet"],["밀가루","🌾","mix"],["생크림","🥛","liquid"],["요거트","🥣","liquid"],["레몬","🍋","fruit"],["라임","🍋‍🟩","fruit"],["블루베리","🫐","fruit"],["포도","🍇","fruit"],["파인애플","🍍","fruit"],["복숭아","🍑","fruit"],["고구마","🍠","veg"],["애호박","🥒","veg"],["가지","🍆","veg"],["상추","🥬","veg"],["양상추","🥬","veg"],["청양고추","🌶️","veg"],["고추","🌶️","veg"],["아보카도","🥑","veg"],["콩나물","🌱","veg"],["두부","◻️","ready"],["김치","🥬","ready"],["김","🍙","ready"],["떡","🍡","ready"],["우동 면","🍜","pasta"],["라면 사리","🍜","pasta"],["돼지고기","🥩","meat"],["소고기","🥩","meat"],["햄","🍖","meat"],["연어","🐟","seafood"],["오징어","🦑","seafood"],["게맛살","🦀","seafood"],["파마산 치즈","🧀","cheese"],["마요네즈","🥫","sauce"],["케첩","🍅","sauce"],["머스터드","🥫","sauce"],["고추장","🌶️","season"],["된장","🥣","season"],["참기름","🫗","fat"],["식초","🧴","season"],["시나몬","🍂","season"],["잼","🍓","sweet"]
].map((x,i)=>({id:"d"+i,name:x[0],emoji:x[1],type:x[2]}));
let uid=1,items=[],plateItems=[],stations={microwave:[],pot:[],pan:[]},kettle={water:false,hot:false},lastScore=null,lastJudgedSignature=null,lastJudgedHtml="";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];

function baseComponents(it){return it.components?it.components.flatMap(c=>baseComponents(c)):[it]}
function allBase(list){return list.flatMap(x=>baseComponents(x))}
function log(msg){const d=document.createElement("div");d.className="logLine";d.textContent=msg;$("#log").prepend(d)}
function stateText(it){const a=[];if(it.isMixture)a.push("혼합물");if(it.cut)a.push(it.def.name==="마늘"?"다짐":"잘림");if(it.crushed)a.push("으깨짐");if(it.isMixture){const n=baseComponents(it).filter(x=>x.cut).length,k=baseComponents(it).filter(x=>x.crushed).length;if(n)a.push("손질 "+n+"개 유지");if(k)a.push("으깬 재료 "+k+"개");}if(it.heat>=80)a.push("과조리");else if(it.heat>=45)a.push("익음");else if(it.heat>=15)a.push("데워짐");else a.push("차가움/생");if(it.method)a.push(it.method==="boil"?"삶음/끓임":it.method==="fry"?"볶음":"구움");if(it.burnt)a.push("탐");if(it.hotWater)a.push("뜨거운 물");return a.join(" · ")}
function createItem(def){return {uid:uid++,def,cut:false,crushed:false,heat:0,hotWater:false,selected:false,isMixture:false,components:null}}
function displayName(it){if(it.isMixture)return it.def.name;if(it.def.name==="마늘")return it.crushed?"으깬 마늘":it.cut?"다진 마늘":"마늘";return it.cut?"자른 "+it.def.name:it.crushed?"으깬 "+it.def.name:it.def.name}
function mixName(parts){const names=parts.flatMap(x=>baseComponents(x).map(c=>displayName(c)));const uniq=[...new Set(names)];return uniq.slice(0,4).join(" + ")+(uniq.length>4?" 외 "+(uniq.length-4)+"개":"")+" 혼합물"}
function mixEmoji(parts){const es=[...new Set(parts.flatMap(x=>baseComponents(x).map(c=>c.def.emoji)))];return es.slice(0,3).join("")}
const typeLabels={liquid:"물 음료",pasta:"면",fruit:"과일",veg:"채소 야채",season:"조미료 양념",sauce:"소스",bread:"빵",meat:"고기 육류",cheese:"치즈 유제품",mix:"믹스",icecream:"아이스크림 디저트",egg:"달걀 계란",fat:"버터 유지",seafood:"해산물",ready:"즉석 식품",sweet:"단맛 디저트"};
function renderInventory(){const q=$("#ingredientSearch").value.trim().toLowerCase().replace(/\s/g,"");const found=defs.filter(d=>(d.name+" "+(typeLabels[d.type]||"")).toLowerCase().replace(/\s/g,"").includes(q));$("#inventory").innerHTML="";$("#ingredientCount").textContent=found.length+" / "+defs.length+"개 재료";found.forEach(d=>{const b=document.createElement("button");b.className="ing";b.innerHTML='<span class="emoji">'+d.emoji+'</span><span class="ingName">'+d.name+'</span>';b.addEventListener("click",()=>{items.push(createItem(d));invalidateScore();log(d.name+"을(를) 작업대에 꺼냈어요.");render()});$("#inventory").appendChild(b)});if(!found.length)$("#inventory").textContent="검색 결과가 없어요. 다른 이름이나 종류를 입력해 보세요."}
function foodButton(it){const b=document.createElement("button");b.className="food"+(it.selected?" selected":"");const comp=it.isMixture?'<div class="components">'+baseComponents(it).map(x=>displayName(x)).join(", ")+'</div>':"";b.innerHTML='<div class="name">'+it.def.emoji+" "+displayName(it)+'</div><div class="state">'+stateText(it)+'</div>'+comp+'<div class="heat"><i style="width:'+Math.min(100,it.heat)+'%"></i></div>';b.addEventListener("click",()=>{it.selected=!it.selected;render()});return b}
function render(){const c=$("#counter");c.innerHTML="";items.forEach(it=>c.appendChild(foodButton(it)));if(!items.length)c.innerHTML='<div class="hint">재료를 왼쪽 보관함에서 꺼내보세요.</div>';$("#selectionText").textContent="선택 "+items.filter(x=>x.selected).length+"개";for(const s of ["microwave","pot","pan"]){const arr=stations[s];$("#"+s+"Inside").textContent=arr.length?arr.map(x=>x.def.emoji+" "+displayName(x)+" ("+stateText(x)+")").join(", "):"비어 있음"}$("#kettleInside").textContent=kettle.hot?"뜨거운 물 준비됨":kettle.water?"물 들어 있음":"물 없음";const p=$("#plate");p.innerHTML=plateItems.length?plateItems.map(x=>'<span title="'+x.def.name+'">'+x.def.emoji+'</span>').join(""):"<span>🍽️</span>";$("#score").textContent=lastScore===null?"미평가":lastScore}
function selected(){return items.filter(x=>x.selected)}
function invalidateScore(){lastScore=null;lastJudgedSignature=null;lastJudgedHtml="";$("#result").className="result";$("#result").textContent="음식이 바뀌었어요. 다시 평가해 보세요."}
function moveTo(st){const sel=selected();if(!sel.length)return log("먼저 작업대에서 재료를 선택하세요.");sel.forEach(x=>{x.selected=false;stations[st].push(x);items=items.filter(y=>y!==x)});invalidateScore();log(sel.length+"개 재료를 "+(st==="microwave"?"전자레인지":st==="pot"?"냄비":"후라이팬")+"에 넣었어요.");render()}
function takeFrom(st){if(!stations[st].length)return log("꺼낼 재료가 없어요.");stations[st].forEach(x=>{x.selected=false;items.push(x)});stations[st]=[];invalidateScore();log("재료를 작업대로 꺼냈어요.");render()}
function doAction(act){
 const sel=selected();
 if(act==="plate"){if(!sel.length)return log("접시에 담을 재료를 선택하세요.");sel.forEach(x=>{x.selected=false;plateItems.push(x);items=items.filter(y=>y!==x)});invalidateScore();log("선택한 재료를 접시에 담았어요.");render();return}
 if(act==="trash"){if(!sel.length)return log("치울 재료를 선택하세요.");items=items.filter(x=>!x.selected);invalidateScore();log("선택한 재료를 치웠어요.");render();return}
 if(!sel.length)return log("먼저 재료를 선택하세요.");
 if(act==="cut"||act==="crush"){let changed=0;sel.forEach(x=>{const targets=baseComponents(x);targets.forEach(c=>{if(act==="cut"){if(!["liquid","sauce","mix","icecream","season","egg","fat","sweet","ready"].includes(c.def.type)&&!c.cut){c.cut=true;if(c.def.name==="마늘")c.crushed=false;changed++}}else if(["마늘","감자","고구마","바나나","딸기","토마토","아보카도"].includes(c.def.name)&&!c.crushed){c.crushed=true;if(c.def.name==="마늘")c.cut=false;changed++}});if(x.isMixture)x.def={...x.def,name:mixName(x.components),emoji:mixEmoji(x.components)};});log(changed?changed+"개 재료를 "+(act==="cut"?"잘랐어요.":"으깼어요."):"이미 처리했거나 이 작업을 할 수 없는 재료예요.");if(changed)invalidateScore();clearSelection();render();return}
 if(act==="mix"){
   if(sel.length<2)return log("섞으려면 2개 이상 선택하세요.");
   const parts=[...sel];const avgHeat=parts.reduce((a,x)=>a+x.heat,0)/parts.length;
   const mix={uid:uid++,def:{name:mixName(parts),emoji:mixEmoji(parts)||"🥣",type:"mixture"},cut:false,crushed:false,heat:avgHeat,hotWater:parts.some(x=>x.hotWater),selected:false,isMixture:true,components:parts};
   items=items.filter(x=>!x.selected);items.push(mix);invalidateScore();log(parts.length+"개 재료를 하나의 혼합물로 섞었어요.");render();return
 }
}
function clearSelection(){items.forEach(x=>x.selected=false)}
function heatMicrowave(sec){if(!stations.microwave.length)return log("전자레인지가 비어 있어요.");stations.microwave.forEach(x=>{let gain=sec/2;if(baseComponents(x).some(c=>c.def.type==="icecream"))gain=sec*1.2;x.heat+=gain;baseComponents(x).forEach(c=>c.heat=Math.max(c.heat,x.heat))});invalidateScore();log("전자레인지로 "+sec+"초 가열했어요.");$("#heatModal").classList.remove("show");render()}
// Cooking progress belongs to each ingredient, including ingredients inside mixtures.
function cookStation(st,mode,sec){
 const batch=stations[st];if(!batch.length)return log("먼저 "+(st==="pot"?"냄비":"후라이팬")+"에 재료를 넣으세요.");
 const base=allBase(batch);
 if(st==="pot"&&!base.some(x=>x.def.name==="물"))return log("냄비에는 물이 필요해요. 물 또는 커피포트의 뜨거운 물을 넣으세요.");
 if(st==="pan"&&base.some(x=>x.def.name==="물"))return log("물이 들어 있는 음식은 냄비에서 끓여 주세요.");
 const gain=sec*(st==="pot"?0.5:mode==="fry"?0.6:0.75);
 for(const x of base){x.heat+=gain;x.method=mode;if(st==="pan"){x.panExposure=(x.panExposure||0)+sec;if(x.panExposure>60)x.burnt=true;} }
 for(const x of batch){if(x.isMixture){x.heat=baseComponents(x).reduce((a,c)=>a+c.heat,0)/baseComponents(x).length;x.method=mode;x.burnt=baseComponents(x).some(c=>c.burnt);}}
 invalidateScore();log((st==="pot"?"냄비에서 끓이기":mode==="fry"?"후라이팬에서 볶기":"후라이팬에서 굽기")+" "+sec+"초 완료. "+(st==="pan"?"뒤집기/젓기로 한쪽이 타는 것을 막으세요.":"물을 빼면 삶은 재료만 꺼낼 수 있어요."));render();
}
function stirPan(){if(!stations.pan.length)return log("후라이팬이 비어 있어요.");allBase(stations.pan).forEach(x=>x.panExposure=0);invalidateScore();log("팬의 재료를 뒤집고 저었어요. 이미 탄 음식은 되돌아오지 않아요.");render();}
function drainPot(){
 if(!stations.pot.length)return log("냄비가 비어 있어요.");
 function removeWater(x){if(x.isMixture){x.components=x.components.map(removeWater).filter(Boolean);if(!x.components.length)return null;x.def={...x.def,name:mixName(x.components),emoji:mixEmoji(x.components)};x.heat=x.components.reduce((a,c)=>a+c.heat,0)/x.components.length;return x;}return x.def.name==="물"?null:x;}
 const before=allBase(stations.pot).filter(x=>x.def.name==="물").length;
 if(!before)return log("뺄 물이 없어요.");stations.pot=stations.pot.map(removeWater).filter(Boolean);invalidateScore();log("냄비의 물을 빼고 삶은 재료를 남겼어요.");render();
}
function dishSignature(){
 const base=allBase(plateItems).map(x=>({
   n:x.def.name,t:x.def.type,c:!!x.cut,cr:!!x.crushed,h:Math.round(x.heat),w:!!x.hotWater,m:x.method||"",b:!!x.burnt
 })).sort((a,b)=>(a.n+a.h).localeCompare(b.n+b.h));
 const top=plateItems.map(x=>({
   mix:!!x.isMixture,n:x.def.name,h:Math.round(x.heat),
   parts:baseComponents(x).map(y=>y.def.name).sort()
 })).sort((a,b)=>a.n.localeCompare(b.n));
 return JSON.stringify({base,top});
}

// The cookbook is separate from the current kitchen save: restarting a recipe never erases discoveries.
const COOK_BOOK_KEY="formwheel_cook_book_v1";
const cookbookRecipes=["과일 디저트","달걀 채소밥","참치 샌드위치","닭고기 채소 플레이트","난 피자","토마토 파스타","BBQ 파스타","브라우니 디저트","고기 채소 플레이트"];
function getCookbook(){try{const v=JSON.parse(localStorage.getItem(COOK_BOOK_KEY)||"{}");return v&&typeof v==="object"&&!Array.isArray(v)?v:{}}catch{return {}}}
function renderCookbook(){
 const records=getCookbook(),list=$("#cookbookList"),count=$("#cookbookCount");
 if(!list||!count)return;
 count.textContent=Object.keys(records).length+"종 발견 · 대표 레시피 "+cookbookRecipes.length+"종";
 list.replaceChildren();
 const keys=[...new Set([...cookbookRecipes,...Object.keys(records)])];
 keys.forEach(name=>{
   const item=records[name],card=document.createElement("div");card.className="manualStep";
   const title=document.createElement("b");title.textContent=item?"✅ "+name+" · 최고 "+item.best+"점":"🔒 "+name;
   card.appendChild(title);
   const detail=document.createElement("span");detail.textContent=item?"발견 "+item.count+"회 · 재료: "+item.ingredients.join(", "):"아직 발견하지 않았어요. 요리를 완성하고 평가해 보세요.";
   card.appendChild(detail);list.appendChild(card);
 });
}
function registerDish(name,score,base){
 try{
   const book=getCookbook(),old=book[name];
   const ingredients=[...new Set(base.map(x=>x.def.name))];
   book[name]={best:Math.max(score,old?.best||0),count:(old?.count||0)+1,ingredients:!old||score>=old.best?ingredients:old.ingredients};
   localStorage.setItem(COOK_BOOK_KEY,JSON.stringify(book));
   if(!old)log("📖 새 요리 발견! "+name+"이(가) 도감에 등록됐어요.");
   else if(score>old.best)log("🏆 "+name+"의 도감 최고 점수를 갱신했어요!");
   renderCookbook();
 }catch{log("도감을 저장하지 못했어요. 브라우저 저장 설정을 확인하세요.");}
}

function judge(){
 if(!plateItems.length){
   $("#result").className="result bad";
   $("#result").textContent="접시가 비어 있어요! 먼저 음식을 담아주세요.";
   return;
 }
 const sig=dishSignature();
 if(sig===lastJudgedSignature){
   $("#result").innerHTML=lastJudgedHtml;
   $("#score").textContent=lastScore;
   log("같은 완성 상태라 이전 평가 "+lastScore+"점을 그대로 표시했어요.");
   return;
 }

 const base=allBase(plateItems);
 const names=base.map(x=>x.def.name);
 const nameSet=new Set(names);
 const unique=[...nameSet];
 const countByName={}; names.forEach(n=>countByName[n]=(countByName[n]||0)+1);

 const fruitNames=defs.filter(d=>d.type==="fruit").map(d=>d.name);
 const fruitExtras=["투게더 아이스크림","꿀","초콜릿","요거트","생크림","잼","시나몬","우유"];
 const recipes=[
{name:"과일 디저트",required:[],oneOf:[fruitNames],optional:[...fruitNames,...fruitExtras],forbidden:["간장","양념된 고기","닭고기","새우","소시지","토마토 소스"],idealMin:2,idealMax:4},
{name:"달걀 채소밥",required:["밥","달걀"],oneOf:[],optional:["당근","대파","양파","간장","소금","버터","시금치"],forbidden:["브라우니 믹스","투게더 아이스크림","초콜릿","꿀"],idealMin:2,idealMax:6},
{name:"참치 샌드위치",required:["식빵","참치 통조림"],oneOf:[],optional:["오이","양배추","토마토","체다 치즈","달걀"],forbidden:["브라우니 믹스","스파게티 면","투게더 아이스크림"],idealMin:2,idealMax:5},
{name:"닭고기 채소 플레이트",required:["닭고기"],oneOf:[["감자","당근","브로콜리","양배추"]],optional:["감자","당근","브로콜리","양배추","양파","소금","바비큐 소스"],forbidden:["투게더 아이스크림","브라우니 믹스","초콜릿"],idealMin:2,idealMax:6},
   {
     name:"난 피자",
     required:["난","모짜렐라"],
     oneOf:[["토마토 소스","바비큐 소스"]],
     optional:["양파","파프리카","양송이 버섯","콘옥수수","양념된 고기","베이컨","다진 마늘","마늘","체다 치즈","토마토","브로콜리","소시지"],
     forbidden:["스파게티 면","브라우니 믹스","투게더 아이스크림","사과"],
     idealMin:3,idealMax:7
   },
   {
     name:"토마토 파스타",
     required:["스파게티 면","토마토 소스"],
     oneOf:[],
     optional:["양파","양송이 버섯","다진 마늘","마늘","베이컨","파프리카","모짜렐라","새우","시금치","체다 치즈","버터"],
     forbidden:["난","브라우니 믹스","투게더 아이스크림"],
     idealMin:2,idealMax:6
   },
   {
     name:"BBQ 파스타",
     required:["스파게티 면","바비큐 소스"],
     oneOf:[],
     optional:["양파","양송이 버섯","양념된 고기","파프리카","콘옥수수"],
     forbidden:["난","브라우니 믹스","투게더 아이스크림"],
     idealMin:2,idealMax:6
   },
   {
     name:"브라우니 디저트",
     required:["브라우니 믹스","물"],
     oneOf:[],
     optional:["투게더 아이스크림",...fruitNames,"우유","버터","초콜릿","꿀","생크림"],
     forbidden:["스파게티 면","난","토마토 소스","바비큐 소스","양념된 고기","베이컨"],
     idealMin:2,idealMax:4
   },
   {
     name:"고기 채소 플레이트",
     required:["양념된 고기"],
     oneOf:[["양파","파프리카","양송이 버섯","콘옥수수"]],
     optional:["양파","파프리카","양송이 버섯","콘옥수수","다진 마늘","마늘","바비큐 소스"],
     forbidden:["스파게티 면","브라우니 믹스","투게더 아이스크림"],
     idealMin:2,idealMax:6
   }
 ];

 function recipeScore(r){
   const missing=[...r.required.filter(n=>!nameSet.has(n)),...r.oneOf.filter(group=>!group.some(n=>nameSet.has(n))).map(group=>group.join(" 또는 "))];
   if(missing.length)return {score:-999,missing};
   const allowed=new Set([...r.required,...r.oneOf.flat(),...r.optional]);
   const allowedUsed=unique.filter(n=>allowed.has(n)).length;
   const unrelated=unique.filter(n=>!allowed.has(n)&&!r.forbidden.includes(n)).length;
   const forbiddenUsed=r.forbidden.filter(n=>nameSet.has(n)).length;
   const variety=Math.min(6,Math.max(0,allowedUsed-1)*2);
   const sizePenalty=Math.max(0,unique.length-r.idealMax)*5;
   return {score:Math.max(0,Math.min(40,24+r.required.length*3+r.oneOf.length*4+Math.min(8,allowedUsed*2)+variety-unrelated*5-forbiddenUsed*12-sizePenalty)),missing:[],unrelated,forbiddenUsed};
 }
 let best={score:-999,name:"자유 요리"};
 for(const r of recipes){const rs=recipeScore(r);if(rs.score>best.score)best={...rs,name:r.name,recipe:r};}
 const isFruitDish=unique.some(n=>fruitNames.includes(n)) && unique.every(n=>fruitNames.includes(n)||fruitExtras.includes(n));
 if(isFruitDish){const f=recipes.find(r=>r.name==="과일 디저트");best={...recipeScore(f),name:f.name,recipe:f};}
 const baseScore=best.score===-999?12:best.score;
 let pts=baseScore;
 const notes=[];
 if(best.score===-999){
   const closest=recipes.map(r=>({r,missing:[...r.required.filter(n=>!nameSet.has(n)),...r.oneOf.filter(group=>!group.some(n=>nameSet.has(n))).map(group=>group.join(" 또는 ")),...r.forbidden.filter(n=>nameSet.has(n)).map(n=>"제외: "+n)]})).sort((a,b)=>a.missing.length-b.missing.length)[0];
   if(closest?.missing.length)notes.push(closest.r.name+" 추천: "+closest.missing.join(", "));
   notes.push("대표 레시피 외의 창작 요리예요.");
 }else notes.push(best.name+" 레시피와 잘 맞아요.");
 const fruitDish=best.name==="과일 디저트";
 const processable=base.filter(x=>["veg","fruit","meat"].includes(x.def.type));
 const prepared=processable.filter(x=>x.cut||x.crushed).length;
 const prepScore=processable.length?Math.round(15*prepared/processable.length):fruitDish?10:8;
 pts+=prepScore;
 const hasMixture=plateItems.some(x=>x.isMixture);
 const mixScore=hasMixture&&base.length>=2?8:0;
 pts+=mixScore;
 let cookingScore=0,cookingCount=0,unsafe=0;
 for(const x of base){
   const t=x.def.type,h=x.heat;
   if(x.burnt||h>=80){unsafe++;cookingCount++;continue;}
   if(["meat","egg","seafood"].includes(t)){cookingCount++;if(h>=45)cookingScore+=1;else unsafe++;}
   else if(t==="pasta"){cookingCount++;if(x.method==="boil"&&h>=15)cookingScore+=1;}
   else if(["veg","bread","cheese","mix"].includes(t)&&!fruitDish){cookingCount++;if(h>=15&&h<80)cookingScore+=1;else if(t==="veg"&&h<15)cookingScore+=0.65;}
 }
 const heatScore=cookingCount?Math.round(20*cookingScore/cookingCount):20;
 pts+=heatScore;
 const properMethod=base.filter(x=>!x.burnt&&x.heat<80&&((x.def.type==="pasta"&&x.method==="boil")||(["meat","egg","seafood"].includes(x.def.type)&&x.heat>=45&&["fry","grill","boil"].includes(x.method)))).length;
 const techniqueScore=Math.min(7,properMethod*3+(fruitDish&&hasMixture?4:0));
 pts+=techniqueScore;
 const varietyScore=Math.min(10,Math.max(0,unique.length-1)*3);
 pts+=varietyScore;
 const duplicateExcess=Object.values(countByName).reduce((a,n)=>a+Math.max(0,n-2),0);
 const excessUnique=Math.max(0,unique.length-(best.recipe?.idealMax||6));
 const unboiledPasta=base.filter(x=>x.def.type==="pasta"&&x.method!=="boil").length;
 const burnt=base.filter(x=>x.burnt).length;
 const over=base.filter(x=>x.heat>=80).length;
 const rawMeat=base.filter(x=>["meat","egg","seafood"].includes(x.def.type)&&x.heat<45).length;
 const penalties=duplicateExcess*6+excessUnique*5+unboiledPasta*12+burnt*18+over*12+rawMeat*28;
 pts-=penalties;
 if(duplicateExcess)notes.push("같은 재료가 너무 많아요.");
 if(excessUnique)notes.push("재료가 너무 많아 조합의 균형이 흐려졌어요.");
 if(unboiledPasta)notes.push("면은 물과 함께 삶아 주세요.");
 if(burnt||over)notes.push("탄 재료나 과조리된 재료를 교체해 주세요.");
 if(rawMeat)notes.push("고기·달걀·해산물을 충분히 가열해 주세요.");
 if(fruitDish)notes.push("새로 추가된 과일도 정상적으로 인정해요!");
 if(best.score===-999)pts=Math.min(74,pts);
 if(rawMeat||burnt||over)pts=Math.min(69,pts);
 const breakdown="레시피 "+baseScore+"/40 · 손질 "+prepScore+"/15 · 혼합 "+mixScore+"/8 · 익힘 "+heatScore+"/20 · 조리법 "+techniqueScore+"/7 · 다양성 "+varietyScore+"/10"+(penalties?" · 감점 -"+penalties:"");
  pts=Math.max(0,Math.min(100,Math.round(pts)));
 lastScore=pts;
 lastJudgedSignature=sig;

 const grade=pts>=90?"훌륭해요!":pts>=75?"잘 만들었어요.":pts>=55?"괜찮지만 개선할 점이 있어요.":"조합이나 조리 상태를 더 다듬어 보세요.";
 const html="<b>"+pts+" / 100점 · "+grade+"</b><br><small>"+breakdown+"</small><br>"+notes.join(" ");
 lastJudgedHtml=html;
 render();
 const r=$("#result");
 r.className="result "+(pts>=75?"good":pts>=45?"warn":"bad");
 r.innerHTML=html;
 log("완성 평가: "+pts+"점");
 registerDish(best.name,pts,base);
 window.dispatchEvent(new CustomEvent("fw:4050:complete",{detail:{gameId:"cook"}}));
}
function resetAll(){items=[];plateItems=[];stations={microwave:[],pot:[],pan:[]};kettle={water:false,hot:false};uid=1;lastScore=null;lastJudgedSignature=null;lastJudgedHtml="";$("#result").className="result";$("#result").textContent="평가 전이에요. 버튼을 여러 번 눌러도 점수는 올라가지 않습니다.";$("#log").innerHTML="";log("새 요리를 시작했어요.");render()}
const COOK_SAVE="formwheel_cook_v1",undoHistory=[];
function kitchenSnapshot(){return JSON.stringify({items,plateItems,stations,kettle,uid,lastScore,lastJudgedSignature,lastJudgedHtml});}
function restoreKitchen(raw){const d=JSON.parse(raw);if(!Array.isArray(d.items)||!Array.isArray(d.plateItems)||!d.stations||!d.kettle||!Number.isInteger(d.uid))throw Error("저장 형식 오류");
 items=d.items;plateItems=d.plateItems;stations=d.stations;kettle=d.kettle;uid=d.uid;lastScore=d.lastScore;lastJudgedSignature=d.lastJudgedSignature;lastJudgedHtml=d.lastJudgedHtml||"";render();
 if(lastJudgedHtml)$("#result").innerHTML=lastJudgedHtml;else invalidateScore();}
function saveKitchen(){try{localStorage.setItem(COOK_SAVE,kitchenSnapshot());}catch{log("저장 공간에 접근할 수 없어 이번 요리는 저장되지 않습니다.");}}
try{const saved=localStorage.getItem(COOK_SAVE);if(saved)restoreKitchen(saved);}catch{log("저장된 요리를 복구하지 못했습니다. 새 요리를 시작합니다.");}
document.addEventListener("click",event=>{
 const button=event.target.closest("button");if(!button||button.id==="undoBtn")return;
 if(!button.matches(".ing,[data-act],[data-put],[data-take],.heatTime,[data-cook],#stirPan,#drainPot,#fillKettle,#boilKettle,#pourKettle,#resetBtn"))return;
 event.kitchenBefore=kitchenSnapshot();
},true);
document.addEventListener("click",event=>{
 const before=event.kitchenBefore;if(before&&kitchenSnapshot()!==before){undoHistory.push(before);if(undoHistory.length>30)undoHistory.shift();saveKitchen();}
});
$("#undoBtn").onclick=()=>{const previous=undoHistory.pop();if(!previous)return log("되돌릴 작업이 없습니다.");restoreKitchen(previous);saveKitchen();log("이전 작업을 되돌렸어요.");};
addEventListener("beforeunload",saveKitchen);
$("#ingredientSearch").addEventListener("input",renderInventory);
const tutorialSteps=[
["1 / 6 · 재료 찾기","검색창에 ‘달걀’ 또는 ‘채소’를 입력해 보세요. 재료를 누르면 작업대에 꺼낼 수 있어요.","#ingredientSearch"],
["2 / 6 · 선택과 손질","작업대 재료를 눌러 선택하세요. 여러 개도 선택할 수 있어요. 채소를 선택하고 자르기를 눌러 보세요.","#counter"],
["3 / 6 · 섞기","재료 2개 이상을 선택한 뒤 섞기를 누르면 하나의 혼합물이 돼요. 섞은 뒤에는 혼합물을 다시 선택하세요.","[data-act='mix']"],
["4 / 6 · 가열","전자레인지로 데우거나, 냄비에 물과 재료를 넣어 삶고, 후라이팬으로 볶고 구워 보세요. 팬은 가열 사이에 뒤집기/젓기를 눌러야 타지 않아요. 20초는 열 +10, 1분은 +30이에요. 고기·달걀·새우는 열 45 이상, 80 미만을 목표로 하세요. 이 수치는 게임 규칙이에요.",".station"],
["5 / 6 · 담기와 평가","작업대의 완성 음식을 선택해 접시에 담고 평가하세요. 같은 접시를 다시 평가해도 점수는 그대로예요.","#judgeBtn"],
["6 / 6 · 자유롭게 도전","예시: 밥 + 달걀 + 당근을 준비 → 당근 손질 → 모두 섞기 → 전자레인지 1분과 40초 가열 → 꺼내기 → 선택 → 접시에 담기 → 평가! 되돌리기로 실수를 고칠 수 있어요. 튜토리얼은 언제든 다시 열 수 있어요.","#undoBtn"]
];
let tutorialIndex=0;
function showTutorial(){const step=tutorialSteps[tutorialIndex];$("#tutorialBar").hidden=false;$("#tutorialTitle").textContent=step[0];$("#tutorialText").textContent=step[1];$$(".tutorialTarget").forEach(x=>x.classList.remove("tutorialTarget"));$(step[2]).classList.add("tutorialTarget");$("#tutorialBack").disabled=tutorialIndex===0;$("#tutorialNext").textContent=tutorialIndex===5?"완료":"다음";}
function endTutorial(){$("#tutorialBar").hidden=true;$$(".tutorialTarget").forEach(x=>x.classList.remove("tutorialTarget"));try{localStorage.setItem("formwheel_cook_tutorial_v1","done");}catch{}}
$("#tutorialBtn").onclick=()=>{tutorialIndex=0;showTutorial();$("#tutorialBar").scrollIntoView({behavior:"smooth",block:"center"});};
$("#tutorialBack").onclick=()=>{if(tutorialIndex>0)tutorialIndex--;showTutorial();};
$("#tutorialNext").onclick=()=>{if(tutorialIndex===5)endTutorial();else{tutorialIndex++;showTutorial();}};
$("#tutorialEnd").onclick=endTutorial;
try{if(!localStorage.getItem("formwheel_cook_tutorial_v1"))showTutorial();}catch{showTutorial();}
renderInventory();render();renderCookbook();log("주방이 준비됐어요. 설명서를 눌러 플레이 방법을 볼 수 있어요.");
$$("[data-act]").forEach(b=>b.addEventListener("click",()=>doAction(b.dataset.act)));$$("[data-put]").forEach(b=>b.addEventListener("click",()=>moveTo(b.dataset.put)));$$("[data-take]").forEach(b=>b.addEventListener("click",()=>takeFrom(b.dataset.take)));$("[data-heat='microwave']").addEventListener("click",()=>$("#heatModal").classList.add("show"));$$(".heatTime").forEach(b=>b.addEventListener("click",()=>heatMicrowave(+b.dataset.sec)));$("#closeHeat").addEventListener("click",()=>$("#heatModal").classList.remove("show"));
$("#fillKettle").addEventListener("click",()=>{kettle.water=true;kettle.hot=false;invalidateScore();log("커피포트에 물을 넣었어요.");render()});$("#boilKettle").addEventListener("click",()=>{if(!kettle.water)return log("먼저 커피포트에 물을 넣으세요.");kettle.hot=true;invalidateScore();log("물이 끓었어요!");render()});$("#pourKettle").addEventListener("click",()=>{if(!kettle.hot)return log("뜨거운 물이 준비되지 않았어요.");const d=defs.find(x=>x.name==="물"),w=createItem(d);w.hotWater=true;w.heat=55;items.push(w);kettle={water:false,hot:false};invalidateScore();log("뜨거운 물을 작업대에 준비했어요.");render()});
$("#judgeBtn").addEventListener("click",judge);$("#resetBtn").addEventListener("click",()=>{if(confirm("현재 요리를 버리고 새로 시작할까요?"))resetAll()});$("#helpBtn").addEventListener("click",()=>$("#helpModal").classList.add("show"));$("#closeHelp").addEventListener("click",()=>$("#helpModal").classList.remove("show"));


$$("[data-cook]").forEach(b=>b.addEventListener("click",()=>cookStation(b.dataset.cook,b.dataset.mode,+b.dataset.sec)));$("#stirPan").addEventListener("click",stirPan);$("#drainPot").addEventListener("click",drainPot);
