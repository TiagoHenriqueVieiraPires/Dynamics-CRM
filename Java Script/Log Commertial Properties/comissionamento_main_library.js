
/****************************************************************/
/*          Códigos Java Scritp's Entidade Comissionamento      */
/*          Autor: Tiago Henrique Vieira Pires                  */
/*          Data : 23/04/2014                                   */
/*          Versão: 1.0                                         */
/****************************************************************/

//Calcula a comissão de acordo com o percentual
function CalculaComissao() {
    if ((Xrm.Page.getAttribute("new_valoraluguel").getValue() !== null) && (Xrm.Page.getAttribute("new_comissaopercentual").getValue() !== null) && ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2))) {
        var valorAluguel = Xrm.Page.getAttribute("new_valoraluguel").getValue();
        var comissaoPercentual = Xrm.Page.getAttribute("new_comissaopercentual").getValue();
        var comissaoValor = valorAluguel * (comissaoPercentual / 100);
        Xrm.Page.getAttribute("new_comissaovalor").setValue(parseFloat(comissaoValor));
    } else {
        Xrm.Page.getAttribute("new_comissaovalor").setValue(0);
    }
}

//Calcula o valor das Parcelas a serem pagas
function CalculaParcela() {
    if ((Xrm.Page.getAttribute("new_quantidadeparcelas").getValue() !== null) && (Xrm.Page.getAttribute("new_comissaovalor").getValue() !== null)) {
        for (x = 1; x <= 10 ; x++) {
            Xrm.Page.getAttribute("new_parcela" + x).setValue(null);
        }
        var qtd = parseInt(Xrm.Page.getAttribute("new_quantidadeparcelas").getValue());
        var valorAluguelMedio = Xrm.Page.getAttribute("new_comissaovalor").getValue();
        var valorParcela = valorAluguelMedio / qtd;
        for (x = 1; x <= qtd; x++) {
            Xrm.Page.getAttribute("new_parcela" + x).setValue(parseFloat(valorParcela));
        }
    } else {
        for (x = 1; x <= 10 ; x++) {
            Xrm.Page.getAttribute("new_parcela" + x).setValue(null);
            Xrm.Page.getAttribute("new_dataparcela" + x).setValue(null);
            Xrm.Page.getAttribute("new_statusparcela" + x).setValue(false);
        }
    }
}

//Mostra e esconde a quantidade de parcelas desejadas
function MostraParcela() {
    if (Xrm.Page.getAttribute("new_quantidadeparcelas").getValue() !== null) {
        for (x = 1; x <= 10 ; x++) {
            Xrm.Page.ui.tabs.get("tab_parcelas").sections.get("tab_parcela_section_" + x).setVisible(false);
        }
        var qtd = parseInt(Xrm.Page.getAttribute("new_quantidadeparcelas").getValue());
        for (x = 1; x <= qtd; x++) {
            Xrm.Page.ui.tabs.get("tab_parcelas").sections.get("tab_parcela_section_" + x).setVisible(true);
        }
    } else {
        for (x = 1; x <= 10 ; x++) {
            Xrm.Page.ui.tabs.get("tab_parcelas").sections.get("tab_parcela_section_" + x).setVisible(false);
        }
    }
}

//Preenche a Unidade de Negócio
function PreencheUnidadeDeNegocio(Guid) {
    var entityUserRetrive = getEntityNodes('systemuser', 'systemuserid', Guid);
    var entityNodeUserRetrive = entityUserRetrive[0];
    var organizationId = entityNodeUserRetrive.selectSingleNode("q1:businessunitid");
    organizationId = organizationId.text;
    var entityRetrive = getEntityNodes('businessunit', 'businessunitid', organizationId);
    var entityNodeRetrive = entityRetrive[0];
    var organizationName = entityNodeRetrive.selectSingleNode("q1:name");
    organizationName = organizationName.text;
    var lookupData = new Array();
    var lookupItem = new Object();
    lookupItem.id = organizationId;
    lookupItem.typename = 'businessunit';
    lookupItem.name = organizationName;
    lookupData[0] = lookupItem;
    Xrm.Page.getAttribute("new_corretoraid").setValue(lookupData);
}

function OnSave_new_comissionamento() {
    CalculaComissao();
    CalculaParcela();
    Xrm.Page.getControl("new_comissaovalor").setDisabled(false);
    forceSave("new_salvar");
}

function OnLoad_new_comissionamento() {
    MostraParcela();
    if ((Xrm.Page.getAttribute("ownerid").getValue() !== null) && (Xrm.Page.getAttribute("new_corretoraid").getValue() == null) && ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2))) {
        PreencheUnidadeDeNegocio(Xrm.Page.getAttribute("ownerid").getValue()[0].id);
    }

    if (Xrm.Page.ui.getFormType() !== 1) {
        Xrm.Page.getControl("new_quantidadeparcelas").setDisabled(true);
        Xrm.Page.getControl("new_comissaopercentual").setDisabled(true);
        Xrm.Page.getControl("new_valoraluguel").setDisabled(true);
        Xrm.Page.getControl("new_corretoraid").setDisabled(true);
        Xrm.Page.getControl("ownerid").setDisabled(true);
        Xrm.Page.getControl("new_contratoid").setDisabled(true);
    }

    for (x = 1; x <= 10; x++) {
        if ((Xrm.Page.getAttribute("new_statusparcela" + x).getValue() == 1) || Xrm.Page.getAttribute("new_statusparcela" + x).getValue() == true) {
            Xrm.Page.getControl("new_parcela" + x).setDisabled(true);
            Xrm.Page.getControl("new_dataparcela" + x).setDisabled(true);
            Xrm.Page.getControl("new_statusparcela" + x).setDisabled(true);
        }
    }
}

function OnChange_new_valoraluguel() {
    CalculaComissao();
    CalculaParcela();
    MostraParcela();
}

function OnChange_new_comissaopercentual() {
    CalculaComissao();
    CalculaParcela();
    MostraParcela();
}

function OnChange_new_quantidadeparcelas() {
    MostraParcela();
    CalculaParcela();
}

function OnChange_ownerid() {
    if (Xrm.Page.getAttribute("ownerid").getValue() !== null) {
        PreencheUnidadeDeNegocio(Xrm.Page.getAttribute("ownerid").getValue()[0].id);
    }
}