import { Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { Medicamentos } from './medicamentos/medicamentos';
import { Movimentacoes } from './movimentacoes/movimentacoes';
import { Alertas } from './alertas/alertas';
import { Lotes } from './lotes/lotes';
import { Relatorios } from './relatorios/relatorios';
import { Rastreamentos } from './rastreamentos/rastreamentos';
import { Usuarios } from './usuarios/usuarios';
import { Fornecedores } from './fornecedores/fornecedores';
import { Reposicao } from './reposicao/reposicao';
import { Erp } from './erp/erp';
import { Configuracoes } from './configuracoes/configuracoes';
import { Suporte } from './suporte/suporte';

export const routes: Routes = [
    {path:"dashboard", component:Dashboard},
    {path:"medicamentos", component: Medicamentos},
    {path:"movimentacoes", component: Movimentacoes},
    {path:"alertas", component: Alertas},
    {path:"lotes", component: Lotes},
    {path:"relatorios", component: Relatorios},
    {path:"rastreamentos", component: Rastreamentos},
    {path:"usuarios", component: Usuarios},
    {path:"fornecedores", component: Fornecedores},
    {path:"reposicao", component: Reposicao},
    {path:"erp", component: Erp},
    {path:"configuracoes", component: Configuracoes},
    {path:"suporte", component: Suporte},
    {path:"", redirectTo: 'dashboard', pathMatch: 'full'}
];