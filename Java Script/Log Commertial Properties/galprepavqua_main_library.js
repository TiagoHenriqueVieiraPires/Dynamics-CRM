/********************************************************************************/
/*          Códigos Java Scritp's Entidade Galpão/Prédio/Pavimento/Quadra       */
/*          Autor: Tiago Henrique Vieira Pires                                  */
/*          Data : 15/09/2014                                                   */
/*          Versão: 4.0                                                         */
/********************************************************************************/

//Busca o total das ABL dos módulos para o Empreendimento
function SomaAblTotalEmpreendimento() {
    if ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2)) {
        var ablTotal = 0.00;
        var idA = 0;
        if (Xrm.Page.ui.getFormType() == 2) { idA = Xrm.Page.data.entity.getId(); }
        var entityRetrive = getEntityNodesDouble('new_galprepavqua', 'new_empreendimentoid', Xrm.Page.getAttribute("new_empreendimentoid").getValue()[0].id, "statecode", "Active");
        if (entityRetrive.length != 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var ablGalpao = entityNodeRetrive.selectSingleNode("q1:new_abl");
                if (ablGalpao !== null) { ablGalpao = ablGalpao.text; } else { ablGalpao = 0.0; }
                var id = entityNodeRetrive.selectSingleNode("q1:new_galprepavquaid");
                id = id.text;
                if ((Xrm.Page.ui.getFormType() == 1) || (idA == id)) {
                    if (Xrm.Page.getAttribute("new_abl").getValue() !== null) {
                        ablGalpao = Xrm.Page.getAttribute("new_abl").getValue();
                    } else { ablGalpao = 0; }
                }
                ablTotal += parseFloat(ablGalpao);
            }
        }
        setEntityNode("new_empreendimento", "new_empreendimentoid", Xrm.Page.getAttribute("new_empreendimentoid").getValue()[0].id, "new_areaabltotal", parseFloat(ablTotal), 0);
    }
}

//Calcula a Quantidade de Galpão
function BuscaDadosNivel3() {
    if (Xrm.Page.ui.getFormType() == 1) {
        Xrm.Page.getAttribute("new_quantidade").setValue(0);
        Xrm.Page.getAttribute("new_numerodedocas").setValue(0);
        Xrm.Page.getAttribute("new_areacomum").setValue(0);
        Xrm.Page.getAttribute("new_areadedocas").setValue(0);
        Xrm.Page.getAttribute("new_areademezanino").setValue(0);
        Xrm.Page.getAttribute("new_areadegalpao").setValue(0);
    } else if (Xrm.Page.ui.getFormType() == 2) {
        var entityRetrive = getEntityNodesDouble('product', 'new_galprepavquaid', Xrm.Page.data.entity.getId(), "statecode", "Active");
        var qtdModulo = 0;
        var qtdDocas = 0;
        var areaComum = 0;
        var areaDocas = 0;
        var areaMezanino = 0;
        var areaGalpao = 0;
        if (entityRetrive.length > 0) {
            qtdModulo = entityRetrive.length * 1;
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var stateCode = entityNodeRetrive.selectSingleNode("q1:statecode");
                if (stateCode !== null) { stateCode = stateCode.text; }
                var numDocas = entityNodeRetrive.selectSingleNode("q1:new_numerodedocas");
                if (numDocas !== null) { numDocas = numDocas.text; } else { numDocas = 0; }
                qtdDocas += parseFloat(numDocas);
                var aComum = entityNodeRetrive.selectSingleNode("q1:new_areacomum");
                if (aComum !== null) { aComum = aComum.text; } else { aComum = 0; }
                areaComum += parseFloat(aComum);
                var aDocas = entityNodeRetrive.selectSingleNode("q1:new_areadedocas");
                if (aDocas !== null) { aDocas = aDocas.text; } else { aDocas = 0; }
                areaDocas += parseFloat(aDocas);
                var aMezanino = entityNodeRetrive.selectSingleNode("q1:new_areademezanino");
                if (aMezanino !== null) { aMezanino = aMezanino.text; } else { aMezanino = 0; }
                areaMezanino += parseFloat(aMezanino);
                var aGalpao = entityNodeRetrive.selectSingleNode("q1:new_areadearmazenagem");
                if (aGalpao !== null) { aGalpao = aGalpao.text; } else { aGalpao = 0; }
                areaGalpao += parseFloat(aGalpao);
            }
        }
        Xrm.Page.getAttribute("new_quantidade").setValue(parseFloat(qtdModulo));
        Xrm.Page.getAttribute("new_numerodedocas").setValue(parseFloat(qtdDocas));
        Xrm.Page.getAttribute("new_areacomum").setValue(parseFloat(areaComum));
        Xrm.Page.getAttribute("new_areadedocas").setValue(parseFloat(areaDocas));
        Xrm.Page.getAttribute("new_areademezanino").setValue(parseFloat(areaMezanino));
        Xrm.Page.getAttribute("new_areadegalpao").setValue(parseFloat(areaGalpao));
    }
}

//Calcula do Área Bruta Locavel do Galpão
function SomaAblTotalGalpao() {
    var aMezanino = Xrm.Page.getAttribute("new_areademezanino").getValue();
    if (aMezanino !== null) { aMezanino = aMezanino * 1 } else { aMezanino = 0.0; }
    var aDocas = Xrm.Page.getAttribute("new_areadedocas").getValue();
    if (aDocas !== null) { aDocas = aDocas * 1 } else { aDocas = 0.0; }
    var aComum = Xrm.Page.getAttribute("new_areacomum").getValue();
    if (aComum !== null) { aComum = aComum * 1 } else { aComum = 0.0; }
    var aGalpao = Xrm.Page.getAttribute("new_areadegalpao").getValue();
    if (aGalpao !== null) { aGalpao = aGalpao * 1 } else { aGalpao = 0.0; }
    var abltotal = (aGalpao * 1) + (aMezanino * 1) + (aDocas * 1) + (aComum * 1);
    Xrm.Page.getAttribute("new_abl").setValue((abltotal * 1));
}

//Seta os tipos do Nivel 2 de acordo com o empreendimento
function BuscaTipoEmpreendimento() {
    if (Xrm.Page.ui.getFormType() == 1) {
        Xrm.Page.getControl("new_tipo").setDisabled(false);
        if (Xrm.Page.getAttribute("new_empreendimentoid").getValue() != null) {
            var entityRetrive = getEntityNodes('new_empreendimento', 'new_empreendimentoid', Xrm.Page.getAttribute("new_empreendimentoid").getValue()[0].id);
            if (entityRetrive.length > 0) {
                var entityNodeRetrive = entityRetrive[0];
                var shopping = entityNodeRetrive.selectSingleNode("q1:new_shopping");
                if (shopping !== null) { shopping = shopping.text; }
                var stripMall = entityNodeRetrive.selectSingleNode("q1:new_stripmall");
                if (stripMall !== null) { stripMall = stripMall.text; }
                if (((stripMall == null) || (stripMall == 0)) && ((shopping == null) || (shopping == 0))) {
                    Xrm.Page.getControl("new_tipo").removeOption(3);
                }
                var condominioLogistico = entityNodeRetrive.selectSingleNode("q1:new_condominiologistico");
                if (condominioLogistico !== null) { condominioLogistico = condominioLogistico.text; }
                if ((condominioLogistico == null) || (condominioLogistico == 0)) {
                    Xrm.Page.getControl("new_tipo").removeOption(1);
                }
                var loteamentoIndustrial = entityNodeRetrive.selectSingleNode("q1:new_loteamentoindustrial");
                if (loteamentoIndustrial !== null) { loteamentoIndustrial = loteamentoIndustrial.text; }
                if ((loteamentoIndustrial == null) || (loteamentoIndustrial == 0)) {
                    Xrm.Page.getControl("new_tipo").removeOption(4);
                }
                var office = entityNodeRetrive.selectSingleNode("q1:new_office");
                if (office !== null) { office = office.text; }
                if ((office == null) || (office == 0)) {
                    Xrm.Page.getControl("new_tipo").removeOption(2);
                }
            }
        }
    }
}

function OnSave_new_galprepavqua() {
    forceSave("new_salvar");
    BuscaDadosNivel3();
    SomaAblTotalGalpao();
    SomaAblTotalEmpreendimento();
    Xrm.Page.getControl("new_areadegalpao").setDisabled(false);
    Xrm.Page.getControl("new_areademezanino").setDisabled(false);
    Xrm.Page.getControl("new_areadedocas").setDisabled(false);
    Xrm.Page.getControl("new_areacomum").setDisabled(false);
    Xrm.Page.getControl("new_numerodedocas").setDisabled(false);
    Xrm.Page.getControl("new_quantidade").setDisabled(false);
    Xrm.Page.getControl("new_abl").setDisabled(false);
    Xrm.Page.getControl("new_tipo").setDisabled(false);
    Xrm.Page.getControl("new_unidadedenegocioid").setDisabled(false);
}

function OnLolad_new_galprepavqua() {
    if (Xrm.Page.ui.getFormType() == 2) {
        BuscaDadosNivel3();
        SomaAblTotalGalpao();
        BuscaTipoEmpreendimento();
        Xrm.Page.getControl("new_unidadedenegocioid").setDisabled(true);
    } else if (Xrm.Page.ui.getFormType() == 1) {
        BuscaTipoEmpreendimento();
        Xrm.Page.getControl("new_unidadedenegocioid").setDisabled(true);
    }
    if ((currentUserHasRole('Administrador do Sistema') !== true) && (currentUserHasRole('Desenvolvimento Imobiliário') !== true) && (Xrm.Page.ui.getFormType() == 2)) {
        DisabledAllRecording();
        HideRibbonButton("new_galprepavqua|NoRelationship|Form|Mscrm.Form.new_galprepavqua.Save-Large");
        HideRibbonButton("new_galprepavqua|NoRelationship|Form|Mscrm.Form.new_galprepavqua.SaveAndClose-Large");
        HideRibbonButton("new_galprepavqua|NoRelationship|Form|Mscrm.Form.new_galprepavqua.Deactivate-Medium");
    }
    TypeNivel();
}

function TypeNivel() {
    if (Xrm.Page.getAttribute("new_tipo").getValue() != null) {
        var tipo = Xrm.Page.getAttribute("new_tipo").getValue();
        if (tipo == 1) {//Galpão
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_galpao").setVisible(true);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_predio").setVisible(false);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_pavimento").setVisible(false);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_quadra").setVisible(false);
        } else if (tipo == 2) {//Prédio
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_galpao").setVisible(false);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_predio").setVisible(true);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_pavimento").setVisible(false);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_quadra").setVisible(false);
        } else if (tipo == 3) {//Pavimento
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_galpao").setVisible(false);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_predio").setVisible(false);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_pavimento").setVisible(true);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_quadra").setVisible(false);
        } else if (tipo == 4) {//Quadra
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_galpao").setVisible(false);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_predio").setVisible(false);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_pavimento").setVisible(false);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_quadra").setVisible(true);
        } else {
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_galpao").setVisible(false);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_predio").setVisible(false);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_pavimento").setVisible(false);
            Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_quadra").setVisible(false);
        }
    } else {
        Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_galpao").setVisible(false);
        Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_predio").setVisible(false);
        Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_pavimento").setVisible(false);
        Xrm.Page.ui.tabs.get("tb_geral").sections.get("tb_geral_quadra").setVisible(false);
    }
}

function OnChange_new_tipo() {
    TypeNivel();
}
