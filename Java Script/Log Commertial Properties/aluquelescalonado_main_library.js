/*****************************************************************/
/*          Códigos Java Scritp's Entidade Aluguel Escalonado    */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data : 10/06/2014                                    */
/*          Versão: 1.0                                          */
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

function BuscaStatusAluguelEscalonadorContrato() {
    var StatusAluguelEscalonadorContrato = 0;
    if (Xrm.Page.getAttribute("new_contratoid").getValue() !== null) {
        var entityRetrive = getEntityNodes("contract", "contractid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id);
        if (entityRetrive.length != 0) {
            var entityNodeRetrive = entityRetrive[0];
            StatusAluguelEscalonadorContrato = entityNodeRetrive.selectSingleNode("q1:new_aluguelescalonado");
            if (StatusAluguelEscalonadorContrato != null) { StatusAluguelEscalonadorContrato = StatusAluguelEscalonadorContrato.text; } else { StatusAluguelEscalonadorContrato = 0; }
        }
    }
    return StatusAluguelEscalonadorContrato;
}

function OnSave_new_aluguelesalonado(prmContext) {
    if (prmContext != null && prmContext.getEventArgs() != null) {
        var wod_SaveMode = prmContext.getEventArgs().getSaveMode();
        if (ValidaEscalonamento() == true) {
            NumeraAluguel();
            forceSave("new_salvar");
            var valor = Xrm.Page.getAttribute("new_contador").getValue();
            Xrm.Page.getAttribute("new_name").setValue(valor + "");
            Xrm.Page.getControl("new_name").setDisabled(false);
        } else {
            alert("A quantidade informda ultrapassou a Vigência do Contrato. Favor conferir.");
            prmContext.getEventArgs().preventDefault();
        }
    }
}

function OnLoad_new_aluguelesalonado() {
    if ((BuscaStatusContrato() !== "1") && (Xrm.Page.ui.getFormType() == 1)) {
        alert("Somente em Contratos Rascunho Valores Escalonados podem ser inseridos.");
        Xrm.Page.ui.close();
    }
    if ((BuscaStatusAluguelEscalonadorContrato() !== "1") && (Xrm.Page.ui.getFormType() == 1)) {
        alert("Valores Escalonados só podem ser inseridos em contrato com Aluguel Escalonado.");
        Xrm.Page.ui.close();
    }
    if ((BuscaStatusContrato() !== "1") && (Xrm.Page.ui.getFormType() == 2)) {
        DisabledAllRecording();
    }
    Xrm.Page.getControl("new_name").setDisabled(true);
}

//Numera Entidade
function NumeraAluguel() {
    if ((Xrm.Page.getAttribute("new_contador").getValue() == null) && (Xrm.Page.getAttribute("new_contratoid").getValue() !== null)) {
        var entityRetrive = getEntityNodes("new_aluguelescalonado", "new_contratoid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id);
        var maior = 0;
        if (entityRetrive.length != 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var campoNumerador = entityNodeRetrive.selectSingleNode("q1:new_contador");
                if (campoNumerador != null) {
                    campoNumerador = campoNumerador.text;
                    campoNumerador = campoNumerador * 1;
                    if (campoNumerador > maior) {
                        maior = campoNumerador;
                    }
                }
            }
            Xrm.Page.getAttribute("new_contador").setValue(parseInt(maior) + 1);
        } else { Xrm.Page.getAttribute("new_contador").setValue(1); }
    }
}

function ValidaEscalonamento() {
    var quantidadeTotal = 0;
    if (Xrm.Page.getAttribute("new_contratoid").getValue() !== null) {
        var entityRetrive = getEntityNodesDouble("new_aluguelescalonado", "new_contratoid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id, "statecode", "Active");
        if (entityRetrive.length != 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var quantidade = entityNodeRetrive.selectSingleNode("q1:new_quantidade");
                if (quantidade !== null) { quantidade = quantidade.text; } else { quantidade = 0; }
                var id = entityNodeRetrive.selectSingleNode("q1:new_aluguelescalonadoid");
                if (id !== null) { id = id.text; } else { id = ""; }
                if (Xrm.Page.ui.getFormType() == 2) {
                    if (Xrm.Page.data.entity.getId() !== id) {
                        quantidadeTotal += (quantidade * 1);
                    }
                } else {
                    quantidadeTotal += (quantidade * 1);
                }

            }
        }
        var entityRetriveContrato = getEntityNodes("contract", "contractid", Xrm.Page.getAttribute("new_contratoid").getValue()[0].id);
        var entityNodeRetriveContrato = entityRetriveContrato[0];
        var vigencia = entityNodeRetriveContrato.selectSingleNode("q1:new_prazodevigencia");
        if (vigencia !== null) { vigencia = vigencia.text; } else { vigencia = 0; }
        if (Xrm.Page.getAttribute("new_quantidade").getValue() !== null) { quantidadeTotal += Xrm.Page.getAttribute("new_quantidade").getValue(); }
        if (quantidadeTotal > vigencia) {
            return false;
        } else {
            return true;
        }
    }
}