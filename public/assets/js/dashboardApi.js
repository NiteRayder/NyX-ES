async function request(path,options={}){const response=await fetch(path,{...options,credentials:'include',headers:{Accept:'application/json',...(options.body?{'Content-Type':'application/json'}:{}),...(options.headers||{})}});let data=null;try{data=await response.json()}catch{}if(!response.ok){if(response.status===401)localStorage.removeItem('guildnexus_nyxeclipse_session');throw new Error(data?.error||`GuildNexus API request failed (${response.status}).`)}return data}
export const dashboardApi={
  me:async()=>{const data=await request('/api/dashboard/me');return{user:data.user}},
  guilds:()=>request('/api/dashboard/guilds'),
  guild:async guildId=>request(`/api/dashboard/guilds/${encodeURIComponent(guildId)}`),
  resources:guildId=>request(`/api/dashboard/guilds/${encodeURIComponent(guildId)}/resources`),
  member:(guildId,userId)=>request(`/api/dashboard/guilds/${encodeURIComponent(guildId)}/members/${encodeURIComponent(userId)}`),
  auditLog:(guildId,params='')=>request(`/api/dashboard/guilds/${encodeURIComponent(guildId)}/audit-log${params}`),
  updateLogging:(guildId,patch)=>request(`/api/dashboard/guilds/${encodeURIComponent(guildId)}/logging`,{method:'PATCH',body:JSON.stringify(patch)}),
  cases:(guildId,params='')=>request(`/api/dashboard/guilds/${encodeURIComponent(guildId)}/cases${params}`),
  updateConfig:(guildId,patch)=>request(`/api/dashboard/guilds/${encodeURIComponent(guildId)}/config`,{method:'PATCH',body:JSON.stringify(patch)}),
};
export function getSelectedGuildId(){return localStorage.getItem('guildnexus_selected_guild')}
export function setSelectedGuildId(guildId){if(guildId)localStorage.setItem('guildnexus_selected_guild',guildId);else localStorage.removeItem('guildnexus_selected_guild')}
