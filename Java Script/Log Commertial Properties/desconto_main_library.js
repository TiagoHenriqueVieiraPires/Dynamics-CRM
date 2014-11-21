/****************************************************************/
/*          Códigos Java Scritp's Entidade Desconto (Contrato)  */
/*          Autor: Tiago Henrique Vieira Pires                  */
/*          Data : 04/04/2014                                   */
/*          Versão: 1.0                                         */
/****************************************************************/

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

//Busca o Status do Contrato
function BuscaStatusDescontoContrato() {
    var StatusDescontoContrato = 1;
    if (Xrm.Page.getAttribute("new_contratoid").getValue() !== null) {
        var entityRetrive = getEntityNodes("contract", "contractid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id);
        if (entityRetrive.length != 0) {
            var entityNodeRetrive = entityRetrive[0];
            StatusDescontoContrato = entityNodeRetrive.selectSingleNode("q1:new_desconto");
            if (StatusDescontoContrato != null) { StatusDescontoContrato = StatusDescontoContrato.text; } else { StatusDescontoContrato = 0; }
        }
    }
    return StatusDescontoContrato;
}

//Numera Entidade
function NumeraDesconto() {
    if ((Xrm.Page.getAttribute("new_codigo").getValue() == null) && (Xrm.Page.getAttribute("new_contratoid").getValue() !== null)) {
        var entityRetrive = getEntityNodes("new_descontocontrato", "new_contratoid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id);
        var maior = 0;
        if (entityRetrive.length != 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var campoNumerador = entityNodeRetrive.selectSingleNode("q1:new_codigo");
                if (campoNumerador != null) {
                    campoNumerador = campoNumerador.text;
                    campoNumerador = campoNumerador * 1;
                    if (campoNumerador > maior) {
                        maior = campoNumerador;
                    }
                }
            }
            Xrm.Page.getAttribute("new_codigo").setValue(parseInt(maior) + 1);
        } else { Xrm.Page.getAttribute("new_codigo").setValue(1); }
    }
}
//verifica se o Desconto foi informado
function VerificaDesconto() {
    if ((Xrm.Page.getAttribute("new_desconto").getValue() == null) && (Xrm.Page.getAttribute("new_descontovalor").getValue() == null)) {
        alert("Informe um desconto.")
        event.returnValue = false;
    }
}

function OnSave_new_descontocontrato() {
    VerificaDesconto();
    NumeraDesconto();
    Xrm.Page.getControl("new_codigo").setDisabled(false);
    forceSave("new_salvar");
}

function OnLoad_new_descontocontrato() {
    if ((BuscaStatusDescontoContrato() !== "1") && (Xrm.Page.ui.getFormType() == 1)) {
        alert("Somente podem ser inseridos em  Contratos com Descontos.");
        Xrm.Page.ui.close();
    }
    if ((BuscaStatusContrato() !== "1") && (Xrm.Page.ui.getFormType() == 1)) {
        alert("Somente em Contratos Rascunho Descontos podem ser inseridos");
        Xrm.Page.ui.close();
    }
    if ((BuscaStatusContrato() !== "1") && (Xrm.Page.ui.getFormType() == 2)) {
        DisabledAllRecording();
    }
}

function OnChange_new_desconto() {
    if (Xrm.Page.getAttribute("new_desconto").getValue() != null) {
        Xrm.Page.getAttribute("new_descontovalor").setValue(null);
    }
}

function OnChange_new_descontovalor() {
    if (Xrm.Page.getAttribute("new_descontovalor").getValue() != null) {
        Xrm.Page.getAttribute("new_desconto").setValue(null);
    }
}