/****************************************************************/
/*          Códigos Java Scritp's Entidade Compromisso     */
/*          Autor: Tiago Henrique Vieira Pires                  */
/*          Data : 02/06/2014                                   */
/*          Versão: 2.0                                         */
/****************************************************************/

function OnSave_appoiment(prmContext) {
    /*  if (prmContext != null && prmContext.getEventArgs() != null) {
          var wod_SaveMode = prmContext.getEventArgs().getSaveMode();
          if ((wod_SaveMode == 5) || (wod_SaveMode == 58)) {
              if (Xrm.Page.getAttribute("new_gostou").getValue() == null) {
                  Xrm.Page.getAttribute("new_gostou").setRequiredLevel("required");
                  prmContext.getEventArgs().preventDefault();
              } else if (Xrm.Page.getAttribute("new_motivoid").getValue() == null) {
                  Xrm.Page.getAttribute("new_motivoid").setRequiredLevel("required");
                  prmContext.getEventArgs().preventDefault();
              } else if (Xrm.Page.getAttribute("new_observacao").getValue() == null) {
                  Xrm.Page.getAttribute("new_observacao").setRequiredLevel("required");
                  prmContext.getEventArgs().preventDefault();
              }
          }
        }*/
    forceSave("new_salvar");
    Xrm.Page.getControl("new_status").setDisabled(false);
    Xrm.Page.getControl("new_solicitarmarcacao").setDisabled(false);
}

function OnLoad_appoiment() {
    Xrm.Page.getAttribute("scheduledstart").setRequiredLevel("required");
    Xrm.Page.getAttribute("scheduledend").setRequiredLevel("required");
    Xrm.Page.getControl("new_status").setDisabled(true);

    if (Xrm.Page.ui.getFormType() == 2) {
        Xrm.Page.getControl("new_tipodeatividade").setDisabled(true);
    }
    OnChange_new_tipodeatividade();

    if (Xrm.Page.getAttribute("new_solicitarmarcacao").getValue() == 1) {
        Xrm.Page.getControl("new_solicitarmarcacao").setDisabled(true);
    }
}

function OnChange_new_tipodeatividade() {
    if (Xrm.Page.getAttribute("new_tipodeatividade").getValue() == 1) {
        Xrm.Page.getAttribute("new_solicitarmarcacao").setRequiredLevel("required");
        Xrm.Page.getControl("new_solicitarmarcacao").setVisible(true);
    } else {
        Xrm.Page.getAttribute("new_solicitarmarcacao").setRequiredLevel("none");
        Xrm.Page.getControl("new_solicitarmarcacao").setVisible(false);
    }
}

/******************************************************/
/*                                                    */
/*                 Botões do Visita                   */
/*                                                    */
/* Ref:$webresource:new_appoiment_main_library        */
/*                                                    */
/******************************************************/

function AgendarCompromisso() {
    if (Xrm.Page.getAttribute("new_status").getValue() == 1) {
        if (((currentUserHasRole('Corretor (Broker)') == true) || (currentUserHasRole('Gerente Comercial (Broker)') == true)) && (Xrm.Page.getAttribute("new_tipodeatividade").getValue() == 1)) {
            alert("Você não tem premissão para Agendar um Visita nos Empreendimentos.Contate o Comercial da LOG.");
        } else {
            Xrm.Page.getAttribute("new_status").setValue(2);
            Xrm.Page.data.entity.save("saveandclose");
        }
    } else { alert("Somente Compromissos 'Pendente Agendamento' podem ser Agendados."); }
}

function CancelarCompromisso() {
    if (Xrm.Page.getAttribute("new_motivoid").getValue() == null) {
        Xrm.Page.getAttribute("new_motivoid").setRequiredLevel("required");
        alert("Preencha o Motivo.");
    } else if (Xrm.Page.getAttribute("new_observacao").getValue() == null) {
        Xrm.Page.getAttribute("new_observacao").setRequiredLevel("required");
        alert("Preencha a Observação.");
    } else {
        Xrm.Page.getAttribute("new_status").setValue(3);
        Xrm.Page.data.entity.save("saveandclose");
    }
}

function FecharCompromisso() {
    if (Xrm.Page.getAttribute("new_tipodeatividade").getValue() == 1) {
        if (Xrm.Page.getAttribute("new_gostou").getValue() == null) {
            Xrm.Page.getAttribute("new_gostou").setRequiredLevel("required");
            alert("Preencha a Informação seo o Cliente Gostou da Visita.");
        } else if (Xrm.Page.getAttribute("new_motivoid").getValue() == null) {
            Xrm.Page.getAttribute("new_motivoid").setRequiredLevel("required");
            alert("Preencha o Motivo.");
        } else if (Xrm.Page.getAttribute("new_observacao").getValue() == null) {
            Xrm.Page.getAttribute("new_observacao").setRequiredLevel("required");
            alert("Preencha a Observação.");
        } else {
            Xrm.Page.getAttribute("new_status").setValue(4);
            Xrm.Page.data.entity.save("saveandclose");
        }
    } else {
        Xrm.Page.getAttribute("new_status").setValue(4);
        Xrm.Page.data.entity.save("saveandclose");
    }
}