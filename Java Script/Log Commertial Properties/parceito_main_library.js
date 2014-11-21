/****************************************************************/
/*          Códigos Java Scritp's Entidade Parceiro             */
/*          Autor: Tiago Henrique Vieira Pires                  */
/*          Data : 15/09/2014                                   */
/*          Versão: 1.0                                         */
/****************************************************************/

function PercentualMrvLogParceiros() {
    if (Xrm.Page.getAttribute("new_empreendimentoid").getValue() !== null) {
        if (Xrm.Page.ui.getFormType() == 1) {
            var entityRetrive = getEntityNodes('new_parceiro', 'new_empreendimentoid', Xrm.Page.getAttribute("new_empreendimentoid").getValue()[0].id);
            var participacaoTotal = 0.00;
            if (Xrm.Page.getAttribute("new_percentual").getValue() != null) {
                participacaoTotal = Xrm.Page.getAttribute("new_percentual").getValue();
                participacaoTotal = parseFloat(participacaoTotal);
            }
            if (entityRetrive.length != 0) {
                for (x = 0; x < entityRetrive.length; x++) {
                    var entityNodeRetrive = entityRetrive[x];
                    var percentualParceiro = entityNodeRetrive.selectSingleNode("q1:new_percentual");
                    percentualParceiro = parseFloat(percentualParceiro.text);
                    participacaoTotal += parseFloat(percentualParceiro);
                }
            }
        } else if (Xrm.Page.ui.getFormType() == 2) {
            var id = Xrm.Page.data.entity.getId();
            var entityRetrive = getEntityNodes('new_parceiro', 'new_empreendimentoid', Xrm.Page.getAttribute("new_empreendimentoid").getValue()[0].id);
            var participacaoTotal = 0.00;
            if (entityRetrive.length != 0) {
                for (x = 0; x < entityRetrive.length; x++) {
                    var entityNodeRetrive = entityRetrive[x];
                    var percentualParceiro = entityNodeRetrive.selectSingleNode("q1:new_percentual");
                    percentualParceiro = parseFloat(percentualParceiro.text);
                    var guidParceiro = entityNodeRetrive.selectSingleNode("q1:new_parceiroid");
                    guidParceiro = guidParceiro.text;
                    if (guidParceiro != id) {
                        participacaoTotal += parseFloat(percentualParceiro);
                    } else {
                        participacaoTotal += Xrm.Page.getAttribute("new_percentual").getValue();
                    }
                }
            }
        }
        var entityRetriveEmpreendimento = getEntityNodes('new_empreendimento', 'new_empreendimentoid', Xrm.Page.getAttribute("new_empreendimentoid").getValue()[0].id);
        if (entityRetriveEmpreendimento.length != 0) {
            var entityNodeRetriveEmpreendimento = entityRetriveEmpreendimento[0];
            var percentualEmpreendimento = entityNodeRetriveEmpreendimento.selectSingleNode("q1:new_mrvlogpercentual");
            percentualEmpreendimento = parseFloat(percentualEmpreendimento.text);
            if ((parseFloat(percentualEmpreendimento) + parseFloat(participacaoTotal)) > 100.00) {
                alert("O % de Participação Total não pode ultrapassar os 100%");
                event.returnValue = false;
            }
        }
    }
}

function OnSave_new_parceiro(prmContext) {
    PercentualMrvLogParceiros();
}

function OnChange_new_percentual() {
    PercentualMrvLogParceiros();
}