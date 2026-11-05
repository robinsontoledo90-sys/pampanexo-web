import test from "node:test";
import assert from "node:assert/strict";
import {authorize,ACTIONS} from "../agente/permissions.mjs";
test("consultas públicas disponibles sin sesión",()=>{
 assert.equal(authorize({action:ACTIONS.PUBLIC_SERVICES}),true);
 assert.equal(authorize({action:ACTIONS.PUBLIC_DIAGNOSIS}),true);
});
test("selector de perfil no concede acceso administrativo",()=>{
 assert.equal(authorize({action:ACTIONS.ADMIN_ORDERS,user:{id:"a",role:"admin"}}),false);
 assert.equal(authorize({action:ACTIONS.ADMIN_ORDERS,user:{id:"a",verified:true,role:"admin"}}),false);
});
test("cliente solo puede leer su propia orden",()=>{
 const user={id:"cliente-1",verified:true,role:"cliente"};
 assert.equal(authorize({action:ACTIONS.CUSTOMER_ORDER,user,orderOwnerId:"cliente-1"}),true);
 assert.equal(authorize({action:ACTIONS.CUSTOMER_ORDER,user,orderOwnerId:"cliente-2"}),false);
});
test("administrador verificado puede administrar",()=>{
 const user={id:"admin-1",verified:true,role:"admin",adminVerified:true};
 assert.equal(authorize({action:ACTIONS.ADMIN_ORDER_UPDATE,user}),true);
 assert.equal(authorize({action:ACTIONS.ADMIN_REPORT,user}),true);
});
test("acciones desconocidas se rechazan",()=>{
 assert.equal(authorize({action:"delete.all",user:{id:"a",verified:true,role:"admin",adminVerified:true}}),false);
});
