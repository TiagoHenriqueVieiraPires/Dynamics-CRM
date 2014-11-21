/*****************************************************************/
/*          Códigos Java Scritp's Entidade CDU                   */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data : 09/09/2014                                    */
/*          Versão: 3.0                                          */
/*****************************************************************/

//Busca o Status do Contrato
function BuscaStatusContrato(type) {
    var StatusContrato = 1;
    var StatusCDUContrato = 0;
    var noParcela = 0;
    var valorCDU = 0;
    var valorTotalCDU = 0;
    var valorTotal = 0;
    if (Xrm.Page.getAttribute("new_contratoid").getValue() !== null) {
        var entityRetrive = getEntityNodes("contract", "contractid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id);
        if (entityRetrive.length != 0) {
            var entityNodeRetrive = entityRetrive[0];
            StatusContrato = entityNodeRetrive.selectSingleNode("q1:new_statusdocontrato");
            if (StatusContrato != null) { StatusContrato = StatusContrato.text; } else { StatusContrato = 1; }
            StatusCDUContrato = entityNodeRetrive.selectSingleNode("q1:new_cdu");
            if (StatusCDUContrato != null) { StatusCDUContrato = StatusCDUContrato.text; } else { StatusCDUContrato = 0; }
            noParcela = entityNodeRetrive.selectSingleNode("q1:new_noparcelascdu");
            if (noParcela != null) { noParcela = noParcela.text; } else { noParcela = 0; }
            valorCDU = entityNodeRetrive.selectSingleNode("q1:new_valorcdu");
            if (valorCDU != null) { valorCDU = valorCDU.text; } else { valorCDU = 0; }
        }
        //Busca Valores do CDU
        var entityRetriveCDU = getEntityNodesDouble("new_cdu", "new_contratoid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id, "statecode", "Active");
        if (entityRetriveCDU.length != 0) {
            for (x = 0; x < entityRetriveCDU.length; x++) {
                var entityNodeRetriveCDU = entityRetriveCDU[x];
                valorTotalCDU = entityNodeRetriveCDU.selectSingleNode("q1:new_valor");
                if (valorTotalCDU != null) { valorTotalCDU = valorTotalCDU.text; } else { valorTotalCDU = 0; }
                var id = entityNodeRetriveCDU.selectSingleNode("q1:new_cduid");
                id = id.text;
                if (Xrm.Page.ui.getFormType() == 2) {
                    if (id == Xrm.Page.data.entity.getId()) { valorTotalCDU = Xrm.Page.getAttribute("new_valor").getValue(); }
                }
                valorTotal += parseFloat(valorTotalCDU);
            }
            if (Xrm.Page.ui.getFormType() == 1) { valorTotal += Xrm.Page.getAttribute("new_valor").getValue(); }
        } else { if (Xrm.Page.getAttribute("new_valor").getValue() !== null) { valorTotal = Xrm.Page.getAttribute("new_valor").getValue(); } }
    }
    if ((entityRetriveCDU.length >= parseInt(noParcela)) && (Xrm.Page.ui.getFormType() == 1) && (type == 1)) {
        alert("A quantidade de parcelas do CDU ja foram Inseridas;");
        Xrm.Page.ui.close();
    }
    if ((StatusContrato !== "1" && StatusContrato !== "6") && (Xrm.Page.ui.getFormType() == 1) && (type == 1)) {
        alert("Somente em Contratos Rascunho CDU's podem ser inseridos.");
        Xrm.Page.ui.close();
    }
    if ((StatusCDUContrato !== "1") && (Xrm.Page.ui.getFormType() == 1)(type == 1)) {
        alert("CDU's só podem ser inseridos em contrato com CDU.");
        Xrm.Page.ui.close();
    }
    if ((StatusContrato !== "1" && StatusContrato !== "6") && (Xrm.Page.ui.getFormType() == 2)(type == 1)) {
        DisabledAllRecording();
    }
    if ((entityRetriveCDU.length >= parseInt(noParcela)) && (Xrm.Page.ui.getFormType() == 1) && (type == 2)) {
        alert("A quantidade de parcelas do CDU ja foram Inseridas.");
        Xrm.Page.getAttribute("new_valor").setValue(null);
        Xrm.Page.getAttribute("new_datadevencimento").setValue(null);
        return false;
    }
    if ((parseFloat(valorTotal.toFixed(2)) > parseFloat(valorCDU)) && (Xrm.Page.ui.getFormType() == 1 || Xrm.Page.ui.getFormType() == 2) && (type == 2)) {
        alert("O Valor do CDU do contrato não pode ser inferior a soma dos valores do CDU.");
        Xrm.Page.getAttribute("new_valor").setValue(null);
        return false;
    }
}

function OnSave_new_cdu() {
    BuscaStatusContrato(2);
}

function OnLoad_new_cdu() {
    BuscaStatusContrato(1);
}