/*****************************************************************/
/*          Códigos Java Scritp's Entidade Fiador                */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data : 05/06/2014                                    */
/*          Versão: 2.0                                          */
/*****************************************************************/

//Busca o Status do Contrato
function BuscaStatusContrato() {
    var StatusContrato = 1;
    if (Xrm.Page.getAttribute("new_contratoid").getValue() !== null) {
        var entityRetrive = getEntityNodes("contract", "contractid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id);
        if (entityRetrive.length != 0) {
            var entityNodeRetrive = entityRetrive[0];
            StatusContrato = entityNodeRetrive.selectSingleNode("q1:new_statusdocontrato");
            if (StatusContrato != null) { StatusContrato = StatusContrato.text; } else { StatusContrato = 1; }
        }
    }
    return StatusContrato;
}


//Busca o Tipo de Garantia
function BuscaStatusFiadorContrato() {
    var StatusFiadorContrato = 0;
    if (Xrm.Page.getAttribute("new_contratoid").getValue() !== null) {
        var entityRetrive = getEntityNodes("contract", "contractid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id);
        if (entityRetrive.length != 0) {
            var entityNodeRetrive = entityRetrive[0];
            StatusFiadorContrato = entityNodeRetrive.selectSingleNode("q1:new_tipodegarantia");
            if (StatusFiadorContrato != null) { StatusFiadorContrato = StatusFiadorContrato.text; } else { StatusFiadorContrato = 0; }
        }
    }
    return StatusFiadorContrato;
}

function OnSave_new_fiador() {
    forceSave("new_salvar");
    Xrm.Page.getControl("new_name").setDisabled(false);
}

function OnLoad_new_fiador() {
    if ((BuscaStatusContrato() !== "1") && (Xrm.Page.ui.getFormType() == 1)) {
        alert("Somente em Contratos Rascunho Fiadores podem ser inseridos");
        Xrm.Page.ui.close();
    }
    if ((BuscaStatusFiadorContrato() !== "1") && (Xrm.Page.ui.getFormType() == 1)) {
        alert("Fiadores só podem ser inseridos em contrato com garantia igual a 'Fiador com Imóvel'");
        Xrm.Page.ui.close();
    }
    if ((BuscaStatusContrato() !== "1") && (Xrm.Page.ui.getFormType() == 2)) {
        DisabledAllRecording();
    }
    Xrm.Page.getControl("new_name").setDisabled(true);
}

function OnChange_new_fiadorid() {
    if (Xrm.Page.getAttribute("new_pessoaid").getValue() !== null) {
        Xrm.Page.getAttribute("new_name").setValue(Xrm.Page.getAttribute("new_pessoaid").getValue()[0].name);
    }
}