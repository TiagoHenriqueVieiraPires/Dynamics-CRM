/****************************************************************/
/*          Códigos Java Scritp's Entidade Receita Variável      */
/*          Autor: Tiago Henrique Vieira Pires                  */
/*          Data : 02/07/2014                                   */
/*          Versão: 2.0                                         */
/****************************************************************/

//Calcula a comissão de acordo com o percentual
function CalculaAluguel() {
    if ((Xrm.Page.getAttribute("new_aluguelbase").getValue() !== null) && (Xrm.Page.getAttribute("new_renda").getValue() !== null) && (Xrm.Page.getAttribute("new_arrecadacao").getValue() !== null)) {
        var aluquelBase = Xrm.Page.getAttribute("new_aluguelbase").getValue();
        var RendaMes = Xrm.Page.getAttribute("new_renda").getValue();
        var percentualArrecadacao = Xrm.Page.getAttribute("new_arrecadacao").getValue();
        var valorPercentualArrecadacao = RendaMes * (percentualArrecadacao / 100);
        if (valorPercentualArrecadacao > aluquelBase) {
            Xrm.Page.getAttribute("new_aluguelcobrado").setValue(parseFloat(valorPercentualArrecadacao));
            Xrm.Page.getAttribute("new_diferenca").setValue(parseFloat(parseFloat(valorPercentualArrecadacao) - parseFloat(aluquelBase)));
        } else {
            Xrm.Page.getAttribute("new_aluguelcobrado").setValue(parseFloat(aluquelBase));
            Xrm.Page.getAttribute("new_diferenca").setValue(0);
        }
    } else {
        Xrm.Page.getAttribute("new_aluguelcobrado").setValue(0);
        Xrm.Page.getAttribute("new_diferenca").setValue(0);
    }
}

function OnSave_new_receitavariavel() {
    CalculaAluguel();
    Xrm.Page.getControl("new_aluguelcobrado").setDisabled(false);
    Xrm.Page.getControl("new_clienteid").setDisabled(false);
    Xrm.Page.getControl("new_contratoid").setDisabled(false);
    Xrm.Page.getControl("new_diferenca").setDisabled(false);
    forceSave("new_salvar");
}

function OnLoad_new_receitavariavel() {
    if (Xrm.Page.ui.getFormType() == 1) {
        if (Xrm.Page.getAttribute("new_contratoid").getValue() != null) {
            var entityUserRetriveC = getEntityNodes('contract', 'contractid', Xrm.Page.getAttribute("new_contratoid").getValue()[0].id);
            var entityNodeUserRetriveC = entityUserRetriveC[0];
            var receitaVariavelId = entityNodeUserRetriveC.selectSingleNode("q1:new_tipodecontratoid");
            receitaVariavelId = receitaVariavelId.text;
            var entityUserRetrive = getEntityNodes('new_tipodecontrato', 'new_tipodecontratoid', receitaVariavelId);
            var entityNodeUserRetrive = entityUserRetrive[0];
            var receitaVariavel = entityNodeUserRetrive.selectSingleNode("q1:new_receitavariavel");
            if (receitaVariavel !== null) { receitaVariavel = receitaVariavel.text; } else { receitaVariavel = 0; }
            if (receitaVariavel !== "1") {
                alert("Não pode ser criado um registro de Recita Variável para um contrato que não possui Receita Variável.");
                Xrm.Page.ui.close();
            }
        }
    }
}

function OnChange_new_aluguelbase() {
    CalculaAluguel();
}

function OnChange_new_renda() {
    CalculaAluguel();
}

function OnChange_new_arrecadacao() {
    CalculaAluguel();
}

function OnChange_new_datadaapuracao() {
    if (inicio = Xrm.Page.getAttribute("new_datadaapuracao").getValue() !== null) {
        var data = Xrm.Page.getAttribute("new_datadaapuracao").getValue();
        var Mes = data.getMonth();
        var Ano = data.getFullYear();
        Xrm.Page.getAttribute("new_mes").setValue(Mes);
        Xrm.Page.getAttribute("new_ano").setValue(parseInt(Ano));
    }
}