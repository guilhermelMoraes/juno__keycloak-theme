import { kcSanitize } from "keycloakify/lib/kcSanitize";
import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import { useInitialize } from "keycloakify/login/Template.useInitialize";
import type { TemplateProps } from "keycloakify/login/TemplateProps";
import { clsx } from "keycloakify/tools/clsx";
import { useSetClassName } from "keycloakify/tools/useSetClassName";
import { useEffect } from "react";
import type { I18n } from "./i18n";
import type { KcContext } from "./KcContext";

import './main.css';

import { DownOutlined } from "@ant-design/icons";
import { Space } from "antd";
import Button from "antd/es/button";
import Col from 'antd/es/col';
import Divider from 'antd/es/divider';
import Dropdown from "antd/es/dropdown/dropdown";
import type { MenuProps } from "antd/es/menu/menu";
import Row from 'antd/es/row';
import Title from "antd/es/typography/Title";


export default function Template(props: TemplateProps<KcContext, I18n>) {
    const {
        displayInfo = false,
        displayMessage = true,
        displayRequiredFields = false,
        headerNode,
        socialProvidersNode = null,
        infoNode = null,
        documentTitle,
        bodyClassName,
        kcContext,
        i18n,
        doUseDefaultCss,
        classes,
        children
    } = props;

    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });

    const { msg, msgStr, currentLanguage, enabledLanguages } = i18n;

    const { realm, auth, url, message, isAppInitiatedAction } = kcContext;

    useEffect(() => {
        document.title = documentTitle ?? msgStr("loginTitle", realm.displayName);
    }, []);

    useSetClassName({
        qualifiedName: "html",
        className: kcClsx("kcHtmlClass")
    });

    useSetClassName({
        qualifiedName: "body",
        className: bodyClassName ?? kcClsx("kcBodyClass")
    });

    const { isReadyToRender } = useInitialize({ kcContext, doUseDefaultCss });

    if (!isReadyToRender) {
        return null;
    }

    const languages: MenuProps['items'] = enabledLanguages.map(({ languageTag, href, label }, i) => {
        return {
            key: languageTag,
            label: (
                <a role="menuitem" id={`language-${i + 1}`} href={href}>
                    {label}
                </a>
            ),
        }
    });

    return (
        <Row justify="center" align="middle" className="juno-row">
            <Col xs={24} lg={16} xl={14}>
                <main id="juno-main">
                    <Title level={1} className="juno text-center">
                        {msg("loginTitleHtml", realm.displayNameHtml)}
                    </Title>
                    <div className={kcClsx("kcFormCardClass")}>
                        <header className={kcClsx("kcFormHeaderClass")}>
                            {enabledLanguages.length > 1 && (
                                <Dropdown menu={{ items: languages }}>
                                    <Button
                                        onClick={(e) => e.preventDefault()}
                                        aria-label={msgStr("languages")}
                                        size="large"
                                    >
                                        <Space>
                                            {currentLanguage.label}
                                            <DownOutlined />
                                        </Space>
                                    </Button>
                                </Dropdown>
                            )}

                            <Divider />

                            {(() => {
                                const node = !(auth !== undefined && auth.showUsername && !auth.showResetCredentials) ? (
                                    <Title level={2}>{headerNode}</Title>
                                ) : (
                                    <div id="kc-username" className={kcClsx("kcFormGroupClass")}>
                                        <label id="kc-attempted-username">{auth.attemptedUsername}</label>
                                        <a id="reset-login" href={url.loginRestartFlowUrl} aria-label={msgStr("restartLoginTooltip")}>
                                            <div className="kc-login-tooltip">
                                                <i className={kcClsx("kcResetFlowIcon")}></i>
                                                <span className="kc-tooltip-text">{msg("restartLoginTooltip")}</span>
                                            </div>
                                        </a>
                                    </div>
                                );

                                if (displayRequiredFields) {
                                    return (
                                        <div className={kcClsx("kcContentWrapperClass")}>
                                            <div className={clsx(kcClsx("kcLabelWrapperClass"), "subtitle")}>
                                                <span className="subtitle">
                                                    <span className="required">*</span>
                                                    {msg("requiredFields")}
                                                </span>
                                            </div>
                                            <div className="col-md-10">{node}</div>
                                        </div>
                                    );
                                }

                                return node;
                            })()}
                        </header>
                        <div id="kc-content">
                            <div id="kc-content-wrapper">
                                {/* App-initiated actions should not see warning messages about the need to complete the action during login. */}
                                {displayMessage && message !== undefined && (message.type !== "warning" || !isAppInitiatedAction) && (
                                    <div
                                        className={clsx(
                                            `alert-${message.type}`,
                                            kcClsx("kcAlertClass"),
                                            `pf-m-${message?.type === "error" ? "danger" : message.type}`
                                        )}
                                    >
                                        <div className="pf-c-alert__icon">
                                            {message.type === "success" && <span className={kcClsx("kcFeedbackSuccessIcon")}></span>}
                                            {message.type === "warning" && <span className={kcClsx("kcFeedbackWarningIcon")}></span>}
                                            {message.type === "error" && <span className={kcClsx("kcFeedbackErrorIcon")}></span>}
                                            {message.type === "info" && <span className={kcClsx("kcFeedbackInfoIcon")}></span>}
                                        </div>
                                        <span
                                            className={kcClsx("kcAlertTitleClass")}
                                            dangerouslySetInnerHTML={{
                                                __html: kcSanitize(message.summary)
                                            }}
                                        />
                                    </div>
                                )}
                                {children}
                                {auth !== undefined && auth.showTryAnotherWayLink && (
                                    <form id="kc-select-try-another-way-form" action={url.loginAction} method="post">
                                        <div className={kcClsx("kcFormGroupClass")}>
                                            <input type="hidden" name="tryAnotherWay" value="on" />
                                            <a
                                                href="#"
                                                id="try-another-way"
                                                onClick={() => {
                                                    document.forms["kc-select-try-another-way-form" as never].requestSubmit();
                                                    return false;
                                                }}
                                            >
                                                {msg("doTryAnotherWay")}
                                            </a>
                                        </div>
                                    </form>
                                )}
                                {socialProvidersNode}
                                {displayInfo && (
                                    <div id="kc-info" className={kcClsx("kcSignUpClass")}>
                                        <div id="kc-info-wrapper" className={kcClsx("kcInfoAreaWrapperClass")}>
                                            {infoNode}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </Col>
        </Row>
    );
}
