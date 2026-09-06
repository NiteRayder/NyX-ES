async function request(path,options={}){const response=await fetch(path,{...options,credentials:'include',headers:{Accept:'application/json',...(options.body?{'Content-Type':'application/json'}:{}),...(options.headers||{})}});let data=null;try{data=await response.json()}catch{}if(!response.ok){if(response.status===401)localStorage.removeItem('guildnexus_nyxeclipse_session');throw new Error(data?.error||`GuildNexus API request failed (${response.status}).`)}return data}
export const dashboardApi={
  me:async()=>{const data=await request('/api/auth/status');return{user:data.user}},
  guilds:()=>request('/api/guilds'),
  guild:async guildId=>{const[guildsData,configData,resources]=await Promise.all([request('/api/guilds'),request(`/api/guilds/${encodeURIComponent(guildId)}/config`),request(`/api/guilds/${encodeURIComponent(guildId)}/discord-data`)]);const guild=(guildsData.guilds||[]).find(item=>item.id===guildId)||{id:guildId,name:'Server'};return{guild:{...guild,config:configData,channels:resources.channels?.length||0,roles:resources.roles?.length||0,memberCount:guild.approximateMemberCount??0,humanCount:guild.approximateMemberCount??0,logging:configData.logging||{}}}},
  resources:guildId=>request(`/api/guilds/${encodeURIComponent(guildId)}/discord-data`),
  member:async()=>({member:null,unavailable:true,message:'Member lookup is not exposed by the current NyX-ES API yet.'}),
  auditLog:async()=>({enabled:false,events:[]}),
  updateLogging:async(guildId,patch)=>{const current=await request(`/api/guilds/${encodeURIComponent(guildId)}/config`);return request(`/api/guilds/${encodeURIComponent(guildId)}/config`,{method:'PUT',body:JSON.stringify({...current,logging:{...(current.logging||{}),...patch}})})},
  cases:async()=>({cases:[],unavailable:true}),
  updateConfig:(guildId,patch)=>request(`/api/guilds/${encodeURIComponent(guildId)}/config`,{method:'PUT',body:JSON.stringify(patch)}).then(data=>data.config||data),
};
export function getSelectedGuildId(){return localStorage.getItem('guildnexus_selected_guild')}
export function setSelectedGuildId(guildId){if(guildId)localStorage.setItem('guildnexus_selected_guild',guildId);else localStorage.removeItem('guildnexus_selected_guild')}
