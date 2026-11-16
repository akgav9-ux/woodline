const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
let step=0,kind='Кухня';
const steps=$$('.step');
const gallery={
'Кухня':['photo-1600585154340-be6161a56a0c','photo-1600607687920-4e2a09cf159d','photo-1600607687939-ce8a6c25118c'],
'Прихожая':['photo-1616486338812-3dadae4b4ace','photo-1618221195710-dd6b41faaea6','photo-1600210492486-724fe5c67fb0'],
'Спальня':['photo-1616486029423-aaa4789e8c9a','photo-1600607687920-4e2a09cf159d','photo-1618221195710-dd6b41faaea6'],
'Системы хранения':['photo-1618221195710-dd6b41faaea6','photo-1616486338812-3dadae4b4ace','photo-1600607687939-ce8a6c25118c'],
'Детская':['photo-1617104678098-de229db51175','photo-1600210492486-724fe5c67fb0','photo-1616486029423-aaa4789e8c9a'],
'Гостиная':['photo-1600210492486-724fe5c67fb0','photo-1600210492493-0946911123ea','photo-1600607687920-4e2a09cf159d']
};
const rates={'Кухня':52000,'Прихожая':28000,'Спальня':36000,'Системы хранения':32000,'Детская':34000,'Гостиная':30000};
const imageUrl=id=>'https://images.unsplash.com/'+id+'?auto=format&fit=crop&w=1000&q=85';
function openGallery(value){
 let modal=$('#galleryModal');
 if(!modal){
  modal=document.createElement('div');modal.id='galleryModal';modal.className='gallery-modal';
  modal.innerHTML='<div class="gallery-panel"><button class="gallery-close" type="button" aria-label="Закрыть">×</button><small class="eyebrow">ПРИМЕРЫ РАБОТ</small><h2 id="galleryTitle"></h2><p class="gallery-note">Здесь показаны демонстрационные фотографии. В версии для производства владелец сайта сможет загружать свои проекты, и они появятся в этой галерее.</p><div class="gallery-images" id="galleryImages"></div><button class="btn gallery-calc" type="button">Рассчитать похожую мебель ↗</button></div>';
  document.body.append(modal);
  modal.querySelector('.gallery-close').onclick=()=>modal.classList.remove('open');
  modal.querySelector('.gallery-calc').onclick=()=>{modal.classList.remove('open');choose(value);$('#calculator').scrollIntoView({behavior:'smooth'});};
  modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.remove('open')});
 }
 $('#galleryTitle').textContent=value;
 $('#galleryImages').innerHTML=(gallery[value]||gallery['Кухня']).map((id,i)=>'<img src="'+imageUrl(id)+'" alt="'+value+' — пример '+(i+1)+'">').join('');
 modal.classList.add('open');
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
 $('#lightingOption').classList.toggle('hide',!['Кухня','Прихожая','Системы хранения','Спальня'].includes(kind));
 if(step===1)$('#dimensionFields').innerHTML=dimensions();
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
