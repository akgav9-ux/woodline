const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let step=0,kind='Кухня',activeGallery='Кухня';
const steps=$$('.step');
const gallery={
'Кухня':['photo-1600585154340-be6161a56a0c','photo-1600607687920-4e2a09cf159d','photo-1600607687939-ce8a6c25118c'],
'Прихожая':['photo-1616486338812-3dadae4b4ace','photo-1618221195710-dd6b41faaea6','photo-1600210492486-724fe5c67fb0'],
'Спальня':['photo-1616486029423-aaa4789e8c9a','photo-1600607687920-4e2a09cf159d','photo-1618221195710-dd6b41faaea6'],
'Гардеробная':['photo-1618221195710-dd6b41faaea6','photo-1616486338812-3dadae4b4ace','photo-1600607687939-ce8a6c25118c'],
'Детская':['photo-1617104678098-de229db51175','photo-1600210492486-724fe5c67fb0','photo-1616486029423-aaa4789e8c9a'],
'Гостиная':['photo-1600210492486-724fe5c67fb0','photo-1600210492493-0946911123ea','photo-1600607687920-4e2a09cf159d']
};
const rates={'Кухня':52000,'Прихожая':28000,'Спальня':36000,'Гардеробная':32000,'Детская':34000,'Гостиная':30000};
const imageUrl=id=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w=1000&q=85';
function openGallery(value){
 let page=$('#galleryPage');
 if(!page){
  page=document.createElement('section');page.id='galleryPage';page.className='gallery-page';
  page.innerHTML='<header class="gallery-header"><button class="gallery-back" type="button">← На главную</button><a class="brand" href="#"><span class="mark">W</span><span>WOODLINE<small>МЕБЕЛЬ ПО ВАШИМ РАЗМЕРАМ</small></span></a><span class="gallery-header-label">КАТАЛОГ РАБОТ</span></header><main class="gallery-content"><div class="gallery-heading"><small class="eyebrow">КОЛЛЕКЦИЯ WOODLINE / ПРИМЕРЫ РАБОТ</small><h1 id="galleryTitle"></h1><p class="gallery-note">Подборка интерьерных решений и примеров исполнения. Фотографии сейчас демонстрационные — их можно заменить на реальные работы мебельного производства.</p></div><div class="gallery-images" id="galleryImages"></div><div class="gallery-bottom"><div><small class="eyebrow">ЕСТЬ ПОХОЖАЯ ИДЕЯ?</small><h2>Создадим проект<br><em>под ваши размеры.</em></h2></div><button class="btn gallery-calc" type="button">Рассчитать похожую мебель ↗</button></div></main>';
  document.body.append(page);
  page.querySelector('.gallery-back').onclick=()=>{page.classList.remove('open');document.body.classList.remove('gallery-lock')};
  page.querySelector('.gallery-calc').onclick=()=>{page.classList.remove('open');document.body.classList.remove('gallery-lock');choose(activeGallery);$('#calculator').scrollIntoView({behavior:'smooth'});};
  page.querySelector('.brand').onclick=e=>{e.preventDefault();page.classList.remove('open');document.body.classList.remove('gallery-lock');window.scrollTo({top:0,behavior:'smooth'});};
 }
 activeGallery=value;
 $('#galleryTitle').textContent=value;
 $('#galleryImages').innerHTML=(gallery[value]||gallery['Кухня']).map((id,i)=>'<button class="gallery-photo" type="button" data-photo="'+i+'" aria-label="Увеличить фотографию '+(i+1)+'"><img src="'+imageUrl(id)+'" alt="'+value+' — пример '+(i+1)+'"><span>Открыть фото ↗</span></button>').join('');
 $$('#galleryImages .gallery-photo').forEach(button=>button.onclick=()=>openLightbox(value,Number(button.dataset.photo)));
 page.classList.add('open');
 document.body.classList.add('gallery-lock');
}
function openLightbox(category,index){
 const images=gallery[category]||gallery['Кухня'];
 let viewer=$('#photoLightbox');
 if(!viewer){
  viewer=document.createElement('div');viewer.id='photoLightbox';viewer.className='photo-lightbox';
  viewer.innerHTML='<button class="lightbox-close" type="button" aria-label="Закрыть">×</button><button class="lightbox-prev" type="button" aria-label="Предыдущее фото">‹</button><img class="lightbox-image" alt=""><button class="lightbox-next" type="button" aria-label="Следующее фото">›</button><div class="lightbox-count"></div>';
  document.body.append(viewer);
  viewer.querySelector('.lightbox-close').onclick=()=>viewer.classList.remove('open');
  viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.classList.remove('open')});
  viewer.querySelector('.lightbox-prev').onclick=()=>{const list=gallery[viewer.dataset.category]||gallery['Кухня'];const i=(Number(viewer.dataset.index)+list.length-1)%list.length;openLightbox(viewer.dataset.category,i)};
  viewer.querySelector('.lightbox-next').onclick=()=>{const list=gallery[viewer.dataset.category]||gallery['Кухня'];const i=(Number(viewer.dataset.index)+1)%list.length;openLightbox(viewer.dataset.category,i)};
  document.addEventListener('keydown',e=>{if(!viewer.classList.contains('open'))return;if(e.key==='Escape')viewer.classList.remove('open');if(e.key==='ArrowLeft')viewer.querySelector('.lightbox-prev').click();if(e.key==='ArrowRight')viewer.querySelector('.lightbox-next').click()});
 }
 viewer.dataset.category=category;viewer.dataset.index=String(index);
 viewer.querySelector('.lightbox-image').src=imageUrl(images[index]);
 viewer.querySelector('.lightbox-image').alt=category+' — фотография '+(index+1);
 viewer.querySelector('.lightbox-count').textContent=(index+1)+' / '+images.length+' · '+category;
 viewer.classList.add('open');
}
function dimensions(){
 if(kind==='Кухня'){
  const layout=$('#layout').value;
  let out='<label>Первая стена (см)<input type="number" min="50" id="wall1" placeholder="Например, 320"></label>';
  if(layout==='corner'||layout==='u')out+='<label>Вторая стена (см)<input type="number" min="50" id="wall2" placeholder="Например, 180"></label>';
  if(layout==='u')out+='<label>Третья стена (см)<input type="number" min="50" id="wall3" placeholder="Например, 250"></label>';
  if(layout==='island')out+='<label>Длина острова (см)<input type="number" min="50" id="islandLength" placeholder="Например, 160"></label><label>Ширина острова (см)<input type="number" min="40" id="islandWidth" placeholder="Например, 90"></label>';
  return out+'<label>Высота помещения (см)<input type="number" min="180" id="height" placeholder="Например, 270"></label>';
 }
 return '<label>Ширина мебели (см)<input type="number" min="40" id="width" placeholder="Например, 240"></label><label>Высота мебели (см)<input type="number" min="40" id="height" placeholder="Например, 250"></label><label>Глубина мебели (см)<input type="number" min="20" id="depth" placeholder="Например, 60"></label>';
}
function render(){
 steps.forEach((el,i)=>el.classList.toggle('active',i===step));
 $('#stepLabel').textContent='ШАГ 0'+(step+1)+' / 03';
 $('#progress').style.width=((step+1)/3*100)+'%';
 $('#back').disabled=step===0;
 $('#next').classList.toggle('hide',step===2);
 $('#recalc').classList.toggle('hide',step!==2);
 $('#layoutLabel').classList.toggle('hide',kind!=='Кухня');
 $('#counterLabel').classList.toggle('hide',kind!=='Кухня');
 $('#lightingOption').classList.toggle('hide',!['Кухня','Прихожая','Гардеробная','Спальня'].includes(kind));
 if(step===1){const saved={};$$('#dimensionFields input').forEach(input=>saved[input.id]=input.value);$('#dimensionFields').innerHTML=dimensions();Object.entries(saved).forEach(([id,value])=>{const input=$('#'+id);if(input)input.value=value;});}
}
function choose(value){
 kind=value;
 $$('#kinds button').forEach(b=>b.classList.toggle('chosen',b.dataset.kind===value));
 $('#previewImage').src=imageUrl((gallery[value]||gallery['Кухня'])[0]);
 $('#resultTitle').textContent='Ваш проект: '+value.toLowerCase();
 render();
}
function val(id){return Number($('#'+id)?.value||0)}
function updateResult(){
 let estimate=0,description='';
 if(kind==='Кухня'){
  const layout=$('#layout').value,w1=val('wall1'),w2=val('wall2'),w3=val('wall3');
  if(!w1){$('#resultPrice').textContent='Заполните размеры';return}
  let total=w1;
  if(layout==='corner')total+=w2;
  if(layout==='u')total+=w2+w3;
  estimate=(total/100)*rates[kind];
  description='Форма: '+$('#layout').selectedOptions[0].text+'. Общая длина линий: '+total+' см.';
  if(layout==='island'){const il=val('islandLength'),iw=val('islandWidth');if(!il||!iw){$('#resultPrice').textContent='Укажите размеры острова';return}estimate+=(il/100)*(iw/100)*85000;description+=' Остров: '+il+' × '+iw+' см.'}
  if(!val('height')){ $('#resultPrice').textContent='Укажите высоту помещения';return}
 }else{
  const w=val('width'),h=val('height'),d=val('depth');
  if(!w||!h||!d){$('#resultPrice').textContent='Заполните размеры';return}
  estimate=(w/100)*(h/100)*rates[kind]*(d/60);
  description='Размеры: '+w+' × '+h+' × '+d+' см.';
 }
 const factors={basic:1,mdf:1.12,milled:1.25,glass:1.3,veneer:1.4};
 estimate*=factors[$('#facade').value]||1;
 if(kind==='Кухня'){const cf={laminate:1,compact:1.12,stone:1.3};estimate*=cf[$('#counter').value]||1}
 if($('#lighting').checked)estimate+=12000;
 const low=Math.round(estimate*.9/1000)*1000,high=Math.round(estimate*1.15/1000)*1000;
 $('#resultDimensions').textContent=description;
 $('#resultPrice').textContent=low.toLocaleString('ru-RU')+' – '+high.toLocaleString('ru-RU')+' ₽';
}
$$('.cat').forEach(card=>card.addEventListener('click',e=>{e.preventDefault();openGallery(card.dataset.kind)}));
$$('#kinds button').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.kind)));
$('#layout').addEventListener('change',()=>{if(step===1)render()});
$('#next').onclick=()=>{
 if(step===0){step=1;render();return}
 const inputs=$$('#dimensionFields input');
 if(inputs.some(input=>!input.value||Number(input.value)<=0)){alert('Заполните все размеры для выбранной конфигурации.');return}
 step=2;render();updateResult();
};
$('#back').onclick=()=>{step=Math.max(0,step-1);render()};
$('#recalc').onclick=updateResult;
$('#calc').addEventListener('change',updateResult);
$('#menu').onclick=()=>$('#nav').classList.toggle('open');
$$('#nav a').forEach(a=>a.onclick=()=>$('#nav').classList.remove('open'));
render();
