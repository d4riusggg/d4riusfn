function incarca() {
  const list = document.getElementById('lista');
  list.innerHTML='';
  db.ref('abonati').on('child_added', snap => {
    const item = snap.val();
    const id = snap.key;
    const div = document.createElement('div');
    div.className='entry';
    div.id = `abonat-${id}`;
    div.innerHTML=`
      <span class="name">${item.nume}</span>
      <span class="date">${item.data}</span>
      <div>
        <button class="archive">Arhivează</button>
        <button class="danger">Șterge</button>
      </div>
    `;
    list.appendChild(div);

    // atașăm evenimentele direct pe butoane
    div.querySelector('.archive').addEventListener('click', () => arhiveaza(id));
    div.querySelector('.danger').addEventListener('click', () => sterge(id));
  });
}

function incarcaArhiva(){
  const arh = document.getElementById('arhiva');
  arh.innerHTML='';
  db.ref('arhiva').on('child_added', snap => {
    const item = snap.val();
    const id = snap.key;
    const div = document.createElement('div');
    div.className='entry';
    div.id = `arhiva-${id}`;
    div.innerHTML=`
      <span class="name">${item.nume}</span>
      <span class="date">${item.data}</span>
      <button class="danger">Șterge</button>
    `;
    arh.appendChild(div);

    // atașăm evenimentul direct
    div.querySelector('.danger').addEventListener('click', () => stergeArhiva(id));
  });
}
// SALVEAZĂ
document.getElementById('salveazaBtn').addEventListener('click', () => {
  const nume = document.getElementById('nume').value.trim();
  if(!nume) return alert('Scrie un nume');
  const data = new Date();
  const dataText = data.toLocaleString('ro-RO', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'});
  
  // push abonat în Firebase
  db.ref('abonati').push({nume, data: dataText}).then(() => {
    document.getElementById('nume').value=''; 
    incarca(); // reîncarcă lista imediat după salvare
  });
});

// ÎNCARCA LISTA
function incarca() {
  const list = document.getElementById('lista');
  list.innerHTML='';
  db.ref('abonati').once('value').then(snapshot => {
    snapshot.forEach(snap => {
      const item = snap.val();
      const id = snap.key;
      const div = document.createElement('div');
      div.className='entry';
      div.id = `abonat-${id}`;
      div.innerHTML=`
        <span class="name">${item.nume}</span>
        <span class="date">${item.data}</span>
        <div>
          <button class="archive">Arhivează</button>
          <button class="danger">Șterge</button>
        </div>
      `;
      list.appendChild(div);
      div.querySelector('.archive').addEventListener('click', () => arhiveaza(id));
      div.querySelector('.danger').addEventListener('click', () => sterge(id));
    });
  });
}

// ÎNCARCA ARHIVA
function incarcaArhiva(){
  const arh = document.getElementById('arhiva');
  arh.innerHTML='';
  db.ref('arhiva').once('value').then(snapshot => {
    snapshot.forEach(snap => {
      const item = snap.val();
      const id = snap.key;
      const div = document.createElement('div');
      div.className='entry';
      div.id = `arhiva-${id}`;
      div.innerHTML=`
        <span class="name">${item.nume}</span>
        <span class="date">${item.data}</span>
        <button class="danger">Șterge</button>
      `;
      arh.appendChild(div);
      div.querySelector('.danger').addEventListener('click', () => stergeArhiva(id));
    });
  });
}

// ARHIVEAZĂ
function arhiveaza(id){
  db.ref('abonati/'+id).once('value').then(snap => {
    const abonat = snap.val();
    db.ref('arhiva/'+id).set(abonat).then(() => {
      db.ref('abonati/'+id).remove().then(() => {
        incarca();
        incarcaArhiva();
      });
    });
  });
}

// ȘTERGE
function sterge(id){ 
  if(confirm('Ștergi acest abonat?')) db.ref('abonati/'+id).remove().then(() => incarca());
}

// ȘTERGE DIN ARHIVĂ
function stergeArhiva(id){ 
  if(confirm('Ștergi acest abonat din arhivă?')) db.ref('arhiva/'+id).remove().then(() => incarcaArhiva());
}
