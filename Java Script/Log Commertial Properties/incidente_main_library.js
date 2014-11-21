/****************************************************************/
/*          Códigos Java Scritp's Entidade Ocorrência           */
/*          Autor: Tiago Henrique Vieira Pires                  */
/*          Data : 07/06/2014                                   */
/*          Versão: 2.0                                         */
/****************************************************************/

//Preenche Titulo da Ocorrência
function PreencheTitulo() {
    if ((Xrm.Page.getAttribute("subjectid").getValue() !== null) && (Xrm.Page.getAttribute("casetypecode").getValue() !== null)) {
        Xrm.Page.getAttribute("title").setValue('[' + Xrm.Page.getAttribute("casetypecode").getSelectedOption().text + '] - ' + Xrm.Page.getAttribute("subjectid").getValue()[0].name);
    }
}

//Calcular o SLA da Ocorrência com Base no Assunto
function CalculaSLA() {
    if (((Xrm.Page.getAttribute("subjectid").getValue() !== null) && (Xrm.Page.getAttribute("followupby").getValue() == null)) || (Xrm.Page.ui.getFormType() == 1)) {
        var entityRetrive = getEntityNodes("subject", "subjectid", Xrm.Page.getAttribute("subjectid").getValue()[0].id);
        var entityNodeRetrive = entityRetrive[0];
        var EntidadePrimaria = entityNodeRetrive.selectSingleNode("q1:parentsubject");
        if (EntidadePrimaria == null) {
            alert("Não é possível inserir um Assunto no 1º Nível");
            Xrm.Page.getAttribute("subjectid").setValue(null);
            Xrm.Page.getAttribute("followupby").setValue(null);
            Xrm.Page.getAttribute("new_assuntosecundarioid").setValue(null);
        }
        else {
            var subjectId = Xrm.Page.getAttribute("subjectid").getValue()[0].id;
            var entityRetrive = getEntityNodes("new_sla", "new_assuntoid", subjectId);
            if (entityRetrive.length != 0) {
                var entityNodeRetrive = entityRetrive[0];
                var prazo = entityNodeRetrive.selectSingleNode("q1:new_prazo");
                var assunto = entityNodeRetrive.selectSingleNode("q1:new_name");
                var assuntoId = entityNodeRetrive.selectSingleNode("q1:new_slaid");
                prazo = parseInt(prazo.text);
                assunto = assunto.text;
                assuntoId = assuntoId.text;
                var dataAtual = new Date();
                var dataFinal = dataAtual;
                var lookupAssunto = new Array();
                var lookupItem = new Object();
                lookupItem.id = assuntoId;
                lookupItem.typename = 'new_sla';
                lookupItem.name = assunto;
                lookupAssunto[0] = lookupItem;
                dataFinal.setDate(dataAtual.getDate() + prazo);
                Xrm.Page.getAttribute("followupby").setValue(new Date(dataFinal));
                Xrm.Page.getAttribute("new_assuntosecundarioid").setValue(lookupAssunto);
            } else {
                alert("SLA não cadastrada para esse Assunto! Contate o Administrador.");
                Xrm.Page.getAttribute("subjectid").setValue(null);
                Xrm.Page.getAttribute("followupby").setValue(null);
                Xrm.Page.getAttribute("new_assuntosecundarioid").setValue(null);
            }
        }
    }
}

function OnSave_incident() {
    OnChange_contractid();
    PreencheTitulo();
    Xrm.Page.getControl("followupby").setDisabled(false);
    Xrm.Page.getControl("new_solicitanteid").setDisabled(false);
    Xrm.Page.getControl("customerid").setDisabled(false);
    Xrm.Page.getControl("new_contratoid").setDisabled(false);
    Xrm.Page.getControl("description").setDisabled(false);
    Xrm.Page.getControl("subjectid").setDisabled(false);
    Xrm.Page.getControl("new_assuntosecundarioid").setDisabled(true);
    forceSave("new_salvar");
}

function OnLoad_incident() {
    OnChange_contractid();
    Xrm.Page.getControl("new_solicitanteid").setDisabled(true);
    Xrm.Page.getControl("followupby").setDisabled(true);
    if (Xrm.Page.ui.getFormType() !== 1) {
        Xrm.Page.getControl("subjectid").setDisabled(true);
        Xrm.Page.getControl("customerid").setDisabled(true);
        Xrm.Page.getControl("new_contratoid").setDisabled(true);
        Xrm.Page.getControl("description").setDisabled(true);
    } else {
        if ((Xrm.Page.getAttribute("ownerid").getValue() !== null) && (Xrm.Page.getAttribute("new_solicitanteid").getValue() == null)) {
            Xrm.Page.getAttribute("new_solicitanteid").setValue(Xrm.Page.getAttribute("ownerid").getValue());
        }
        OnChange_customerid();
    }
}

function OnChange_subjectid() {
    CalculaSLA();
}

function OnChange_contractid() {
    Xrm.Page.getAttribute("contractdetailid").setRequiredLevel("none");
}

function OnChange_customerid() {
    if (Xrm.Page.getAttribute("customerid").getValue() == null) {
        Xrm.Page.getControl("new_contratoid").setDisabled(true);
        Xrm.Page.getAttribute("new_contratoid").setValue(null);
    } else {
        Xrm.Page.getControl("new_contratoid").setDisabled(false);
    }
}

function OnChangeVerificaAssunto() {
    if (Xrm.Page.getAttribute("subjectid").getValue() !== null) {
        var entityRetrive = getEntityNodes("subject", "subjectid", Xrm.Page.getAttribute("subjectid").getValue()[0].id);
        var entityNodeRetrive = entityRetrive[0];
        var EntidadePrimaria = entityNodeRetrive.selectSingleNode("q1:parentsubject");
        if (EntidadePrimaria == null) {
            alert("Não é possível inserir um Assunto no 1º Nível");
            //Xrm.Page.getAttribute("subjectid").setValue(null);
            Xrm.Page.getAttribute("subjectid").setValue("");
        }
    }
}