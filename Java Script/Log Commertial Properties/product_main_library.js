/******************************************************************/
/*          Códigos Java Scritp's Entidade Produto (Modulo)      */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data : 15/09/2014                                    */
/*          Versão: 5.0                                          */
/*****************************************************************/

//Busca o total das ABL dos módulos para o Empreendimento
function SomaAblTotalEmpreendimento() {
    if ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2)) {
        var ablTotal = 0.00;
        var entityRetrive = getEntityNodesDouble('new_galprepavqua', 'new_empreendimentoid', Xrm.Page.getAttribute("new_empreendimentoid").getValue()[0].id, "statecode", "Active");
        if (entityRetrive.length != 0) {
            for (x = 0; x < entityRetrive.length; x++) {
                var entityNodeRetrive = entityRetrive[x];
                var ablGalpao = entityNodeRetrive.selectSingleNode("q1:new_abl");
                if (ablGalpao !== null) { ablGalpao = ablGalpao.text; } else { ablGalpao = 0.0; }
                ablTotal += parseFloat(ablGalpao);
            }
        }
        setEntityNode("new_empreendimento", "new_empreendimentoid", Xrm.Page.getAttribute("new_empreendimentoid").getValue()[0].id, "new_areaabltotal", parseFloat(ablTotal), 0);
    }
}

//Calcula a Quantidade de Galpão
function BuscaDadosNivel3() {
    var entityRetrive = getEntityNodesDouble('product', 'new_galprepavquaid', Xrm.Page.getAttribute("new_galprepavquaid").getValue()[0].id, "statecode", "Active");
    var qtdModulo = 0;
    var qtdDocas = 0;
    var areaComum = 0;
    var areaDocas = 0;
    var areaMezanino = 0;
    var areaGalpao = 0;
    var areaAblTotal = 0;
    var tQtdDocas = 0;
    if (Xrm.Page.getAttribute("new_numerodedocas").getValue() !== null) { tQtdDocas = Xrm.Page.getAttribute("new_numerodedocas").getValue(); }
    var tAreaComum = 0;
    if (Xrm.Page.getAttribute("new_areacomum").getValue() !== null) { tAreaComum = Xrm.Page.getAttribute("new_areacomum").getValue(); }
    var tAreaDocas = 0;
    if (Xrm.Page.getAttribute("new_areadedocas").getValue() !== null) { tAreaDocas = Xrm.Page.getAttribute("new_areadedocas").getValue(); }
    var tAreaMezanino = 0;
    if (Xrm.Page.getAttribute("new_areademezanino").getValue() !== null) { tAreaMezanino = Xrm.Page.getAttribute("new_areademezanino").getValue(); }
    var tAreaGalpao = 0;
    if (Xrm.Page.getAttribute("new_areadearmazenagem").getValue() !== null) { tAreaGalpao = Xrm.Page.getAttribute("new_areadearmazenagem").getValue(); }
    var tAreaAblTotal = 0;
    if (Xrm.Page.getAttribute("new_abl").getValue() !== null) { tAreaAblTotal = Xrm.Page.getAttribute("new_abl").getValue(); }
    var idA = Xrm.Page.data.entity.getId();
    if (Xrm.Page.ui.getFormType() == 1) { qtdModulo = (parseInt(entityRetrive.length) + 1); }
    else { qtdModulo = parseInt(entityRetrive.length); }
    if (entityRetrive.length > 0) {
        for (x = 0; x < entityRetrive.length; x++) {
            var entityNodeRetrive = entityRetrive[x];
            var id = entityNodeRetrive.selectSingleNode("q1:productid");
            if (id !== null) { id = id.text; }
            var stateCode = entityNodeRetrive.selectSingleNode("q1:statecode");
            if (stateCode !== null) { stateCode = stateCode.text; }
            var numDocas = entityNodeRetrive.selectSingleNode("q1:new_numerodedocas");
            if (numDocas !== null) { numDocas = numDocas.text; } else { numDocas = 0; }
            if ((Xrm.Page.ui.getFormType() == 1) || (idA == id)) { qtdDocas += parseInt(tQtdDocas); }
            else { qtdDocas += parseInt(numDocas); }
            var aComum = entityNodeRetrive.selectSingleNode("q1:new_areacomum");
            if (aComum !== null) { aComum = aComum.text; } else { aComum = 0; }
            if ((Xrm.Page.ui.getFormType() == 1) || (idA == id)) { areaComum += parseFloat(tAreaComum); }
            else { areaComum += parseFloat(aComum); }
            var aDocas = entityNodeRetrive.selectSingleNode("q1:new_areadedocas");
            if (aDocas !== null) { aDocas = aDocas.text; } else { aDocas = 0; }
            if ((Xrm.Page.ui.getFormType() == 1) || (idA == id)) { areaDocas += parseFloat(tAreaDocas); }
            else { areaDocas += parseFloat(aDocas); }
            var aMezanino = entityNodeRetrive.selectSingleNode("q1:new_areademezanino");
            if (aMezanino !== null) { aMezanino = aMezanino.text; } else { aMezanino = 0; }
            if ((Xrm.Page.ui.getFormType() == 1) || (idA == id)) { areaMezanino += parseFloat(tAreaMezanino); }
            else { areaMezanino += parseFloat(aMezanino); }
            var aGalpao = entityNodeRetrive.selectSingleNode("q1:new_areadearmazenagem");
            if (aGalpao !== null) { aGalpao = aGalpao.text; } else { aGalpao = 0; }
            if ((Xrm.Page.ui.getFormType() == 1) || (idA == id)) { areaGalpao += parseFloat(tAreaGalpao); }
            else { areaGalpao += parseFloat(aGalpao); }
            var aAblTotal = entityNodeRetrive.selectSingleNode("q1:new_abl");
            if (aAblTotal !== null) { aAblTotal = aAblTotal.text; } else { aAblTotal = 0; }
            if ((Xrm.Page.ui.getFormType() == 1) || (idA == id)) { areaAblTotal += parseFloat(tAreaAblTotal); }
            else { areaAblTotal += parseFloat(aAblTotal); }
        }
    }
    setEntityNode("new_galprepavqua", "new_galprepavquaid", Xrm.Page.getAttribute("new_galprepavquaid").getValue()[0].id, "new_quantidade", parseInt(qtdModulo), 0);
    setEntityNode("new_galprepavqua", "new_galprepavquaid", Xrm.Page.getAttribute("new_galprepavquaid").getValue()[0].id, "new_numerodedocas", parseInt(qtdDocas), 0);
    setEntityNode("new_galprepavqua", "new_galprepavquaid", Xrm.Page.getAttribute("new_galprepavquaid").getValue()[0].id, "new_areacomum", parseFloat(areaComum), 0);
    setEntityNode("new_galprepavqua", "new_galprepavquaid", Xrm.Page.getAttribute("new_galprepavquaid").getValue()[0].id, "new_areadedocas", parseFloat(areaDocas), 0);
    setEntityNode("new_galprepavqua", "new_galprepavquaid", Xrm.Page.getAttribute("new_galprepavquaid").getValue()[0].id, "new_areademezanino", parseFloat(areaMezanino), 0);
    setEntityNode("new_galprepavqua", "new_galprepavquaid", Xrm.Page.getAttribute("new_galprepavquaid").getValue()[0].id, "new_areadegalpao", parseFloat(areaGalpao), 0);
    setEntityNode("new_galprepavqua", "new_galprepavquaid", Xrm.Page.getAttribute("new_galprepavquaid").getValue()[0].id, "new_abl", parseFloat(areaAblTotal), 0);
}

//Calcula do Área Bruta Locavel do Galpão
function SomaAblTotalModulo() {
    var aMezanino = Xrm.Page.getAttribute("new_areademezanino").getValue();
    if (aMezanino !== null) { aMezanino = aMezanino * 1; } else { aMezanino = 0.0; }
    var aDocas = Xrm.Page.getAttribute("new_areadedocas").getValue();
    if (aDocas !== null) { aDocas = aDocas * 1; } else { aDocas = 0.0; }
    var aComum = Xrm.Page.getAttribute("new_areacomum").getValue();
    if (aComum !== null) { aComum = aComum * 1; } else { aComum = 0.0; }
    var aGalpao = Xrm.Page.getAttribute("new_areadearmazenagem").getValue();
    if (aGalpao !== null) { aGalpao = aGalpao * 1; } else { aGalpao = 0.0; }
    var abltotal = (aGalpao * 1) + (aMezanino * 1) + (aDocas * 1) + (aComum * 1);
    Xrm.Page.getAttribute("new_abl").setValue((abltotal * 1));
}

function OnSave_product() {
    if ((currentUserHasRole('Desenvolvimento Imobiliário') == true) || (currentUserHasRole('Administrador do Sistema') == true)) {
        SomaAblTotalModulo();
        BuscaDadosNivel3();
        SomaAblTotalEmpreendimento();
    }
    forceSave("new_salvar");
    Xrm.Page.getControl("new_abl").setDisabled(false);
    Xrm.Page.getControl("new_tipomaterial").setDisabled(false);
    Xrm.Page.getControl("price").setDisabled(false);
    Xrm.Page.getControl("standardcost").setDisabled(false);
    Xrm.Page.getControl("currentcost").setDisabled(false);
    Xrm.Page.getControl("new_salvar").setDisabled(false);
    Xrm.Page.getControl("pricelevelid").setDisabled(false);
    Xrm.Page.getControl("productnumber").setDisabled(false);
    autoEnumeradorEntity("product", "quantitydecimal", 2, "productnumber", "new_contador");
}

function OnLoad_product() {
    if (Xrm.Page.ui.getFormType() == 2) {
        SomaAblTotalModulo();
    }
    if (Xrm.Page.ui.getFormType() == 1) {
        Xrm.Page.getAttribute("quantityonhand").setValue(1);
        Xrm.Page.getAttribute("quantitydecimal").setValue(2);
        SetDefaultDefaultAndUom("defaultuomscheduleid", "defaultuomid");
        Xrm.Page.getAttribute("productnumber").setValue("0");
        Xrm.Page.getAttribute("new_contador").setValue(0);
        Xrm.Page.getAttribute("new_numerodedocas").setValue(0);
        Xrm.Page.getAttribute("new_areacomum").setValue(0);
        Xrm.Page.getAttribute("new_areadedocas").setValue(0);
        Xrm.Page.getAttribute("new_areademezanino").setValue(0);
        Xrm.Page.getAttribute("new_areadearmazenagem").setValue(0);
    }
    DesativaDados();
    Xrm.Page.getControl("productnumber").setDisabled(true);
    TypeNivel();
}

function OnChange_new_areadedocas() {
    SomaAblTotalModulo();
}

function OnChange_new_areadearmazenagem() {
    SomaAblTotalModulo();
}

function OnChange_new_areacomum() {
    SomaAblTotalModulo();
}

function OnChange_new_areademezanino() {
    SomaAblTotalModulo();
}

function DesativaDados() {
    if ((currentUserHasRole('Comercial LOG') == true) && (Xrm.Page.ui.getFormType() == 2)) {
        DisabledAllRecording();
        Xrm.Page.getControl("price").setDisabled(false);
        Xrm.Page.getControl("standardcost").setDisabled(false);
        Xrm.Page.getControl("currentcost").setDisabled(false);
        Xrm.Page.getControl("pricelevelid").setDisabled(false);
        Xrm.Page.getAttribute("price").setRequiredLevel("required");
        Xrm.Page.getAttribute("standardcost").setRequiredLevel("required");
        Xrm.Page.getAttribute("currentcost").setRequiredLevel("required");
        Xrm.Page.getAttribute("pricelevelid").setRequiredLevel("required");
    } else if (currentUserHasRole('Desenvolvimento Imobiliário') == true) {
        Xrm.Page.getControl("price").setDisabled(true);
        Xrm.Page.getControl("standardcost").setDisabled(true);
        Xrm.Page.getControl("currentcost").setDisabled(true);
        Xrm.Page.getControl("pricelevelid").setDisabled(true);
        Xrm.Page.getAttribute("price").setRequiredLevel("recommended");
        Xrm.Page.getAttribute("standardcost").setRequiredLevel("recommended");
        Xrm.Page.getAttribute("currentcost").setRequiredLevel("recommended");
        Xrm.Page.getAttribute("pricelevelid").setRequiredLevel("recommended");
    } else if ((currentUserHasRole('Administrador do Sistema') !== true) && (Xrm.Page.ui.getFormType() == 2)) {
        DisabledAllRecording();
        HideRibbonButton("product|NoRelationship|Form|Mscrm.Form.product.Save-Large");
        HideRibbonButton("product|NoRelationship|Form|Mscrm.Form.product.SaveAndClose-Large");
        HideRibbonButton("product|NoRelationship|Form|Mscrm.Form.product.Deactivate-Medium");
    }
}

function TypeNivel() {
    if (Xrm.Page.getAttribute("new_tipomaterial").getValue() != null) {
        var tipo = Xrm.Page.getAttribute("new_tipomaterial").getValue();
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