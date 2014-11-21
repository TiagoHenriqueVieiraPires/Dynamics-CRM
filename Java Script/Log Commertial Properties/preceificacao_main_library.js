/*****************************************************************/
/*          Códigos Java Scritp's Entidade Precificação          */
/*          Autor: Tiago Henrique Vieira Pires                   */
/*          Data : 15/09/2014                                    */
/*          Versão: 1.0                                          */
/*****************************************************************/

function OnLoad_new_precificacao() {
    if ((Xrm.Page.ui.getFormType() == 1) || (Xrm.Page.ui.getFormType() == 2)) {
        Xrm.Page.getControl("new_name").setVisible(true);
        var atrname = "new_name";
        var textoBotao = "Precificar";
        if (document.getElementById(atrname) != null) {
            var fieldId = "field" + atrname;
            if (document.getElementById(fieldId) == null) {
                var elementId = document.getElementById(atrname + "_d");
                elementId.innerHTML = '<button id="' + fieldId + '"  type="button" style="width: 120px; height=40px;font:20px;" >' + textoBotao + '</button>';
                elementId.style.height = "60px";
                document.getElementById(fieldId).onclick = function () {
                    Precificar();
                };
            }
        }
    } else {
        Xrm.Page.getControl("new_name").setVisible(false);
    }
}

function OnSave_new_precificacao() {

}

function OnChange_new_name() {

}

function Precificar() {
    var valor1 = Xrm.Page.getAttribute("new_price").getValue();
    var valor2 = Xrm.Page.getAttribute("new_standardcost").getValue();
    var valor3 = Xrm.Page.getAttribute("new_currentcost").getValue();
    var empreendimentoId = Xrm.Page.getAttribute("new_empreendimentoid").getValue()[0].id;
    if ((valor1 !== null) && (valor2 !== null) && (valor3 !== null)) {
        if (confirm('Todos os Produtos do Empreendimento serão precificados iguais. Deseja Continuar?')) {
            /*Produto*/
            var entityRetriveProduto = getEntityNodes("product", "new_empreendimentoid", empreendimentoId);
            if (entityRetriveProduto.length != 0) {
                for (x = 0; x < entityRetriveProduto.length; x++) {
                    var entityNodeRetriveProduto = entityRetriveProduto[x];
                    var productId = entityNodeRetriveProduto.selectSingleNode("q1:productid");
                    productId = productId.text;
                    setEntityNode("product", "productid", productId, "price", parseFloat(valor1), 0);
                    setEntityNode("product", "productid", productId, "standardcost", parseFloat(valor2), 0);
                    setEntityNode("product", "productid", productId, "currentcost", parseFloat(valor3), 0);
                }
                alert("Produtos precificados.");
                Xrm.Page.getAttribute("statuscode").setValue(100000000);
                Xrm.Page.data.entity.save("save");
                /*Produto*/
            } else {
                alert("Não foram encontrados Produtos para serem precificados.");
            }
        } else {
            alert("Precificação Cancelada.");
            return null;
        }
    } else {
        alert("Preencha todos os campos de valor.");
        return null;
    }
}