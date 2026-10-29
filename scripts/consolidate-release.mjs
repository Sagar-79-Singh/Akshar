// electron-builder can create multiple GitHub releases for the same tag when
// independent OS jobs publish. Merge their assets into the oldest release.
const token=process.env.GH_TOKEN;
const repo=process.env.GITHUB_REPOSITORY;
const tag=process.env.GITHUB_REF_NAME;
if(!token||!repo||!tag?.startsWith('v'))throw Error('Missing release environment');
const headers={Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
async function request(url,options={}){const res=await fetch(url,{...options,headers:{...headers,...options.headers}});if(!res.ok)throw Error(`${options.method||'GET'} ${url}: ${res.status} ${await res.text()}`);return res}
const base=`https://api.github.com/repos/${repo}`;
const releases=await (await request(`${base}/releases?per_page=100`)).json();
const matching=releases.filter(r=>r.tag_name===tag).sort((a,b)=>a.id-b.id);
if(!matching.length)throw Error(`No release found for ${tag}`);
const primary=matching[0];
const names=new Set(primary.assets.map(a=>a.name));
for(const duplicate of matching.slice(1)){
  for(const asset of duplicate.assets){
    if(names.has(asset.name))continue;
    const downloaded=await request(`${base}/releases/assets/${asset.id}`,{headers:{Accept:'application/octet-stream'}});
    const bytes=await downloaded.arrayBuffer();
    const upload=`https://uploads.github.com/repos/${repo}/releases/${primary.id}/assets?name=${encodeURIComponent(asset.name)}`;
    await request(upload,{method:'POST',headers:{'Content-Type':'application/octet-stream','Content-Length':String(bytes.byteLength)},body:bytes});
    names.add(asset.name);console.log(`Transferred ${asset.name}`);
  }
  await request(`${base}/releases/${duplicate.id}`,{method:'DELETE'});
  console.log(`Removed duplicate release ${duplicate.id}`);
}
console.log(`Release ${primary.html_url}: ${names.size} assets`);
