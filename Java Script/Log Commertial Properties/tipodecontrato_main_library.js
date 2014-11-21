/*****************************************************************/
/*          Códigos Java Scritp's Entidade Tipo de Contrato      */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data : 02/05/2014                                    */
/*          Versão: 1.0                                          */
/*****************************************************************/

function OnSave_new_tipodecontrato() {

}

function OnLoad_new_tipodecontrato() {
    if (Xrm.Page.ui.getFormType() == 1) {
        Xrm.Page.getControl("new_receitavariavel").setDisabled(false);
    }
}