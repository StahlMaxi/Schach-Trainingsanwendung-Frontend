import React from "react";
import styled from "styled-components";
import { DeviceSize } from "../../responsive";

const PageContainer = styled.div`
    height: calc(100vh - 60px);
    padding: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};

    @media (max-width: ${DeviceSize.mobile}px) {
        padding: 20px;
    }
`;

const ContentWrapper = styled.div`
    max-width: 800px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`;

const Heading = styled.h1`
    font-size: 2rem;
    font-weight: bold;
    color: ${(props) => props.theme.colors.primary};
    margin-bottom: 10px;
    text-align: center;
`;

const SectionTitle = styled.h2`
    font-size: 1.4rem;
    font-weight: bold;
    margin-top: 20px;
    color: ${(props) => props.theme.colors.text};
`;

const Paragraph = styled.p`
    line-height: 1.6;
    font-size: 1rem;
    color: ${(props) => props.theme.colors.textLight || props.theme.colors.text};
`;

export function ChessOpeningPage() {
    return (
        <PageContainer>
            <ContentWrapper>
                <Heading>Was ist eine Schacheröffnung?</Heading>

                <Paragraph>
                    Eine <strong>Schacheröffnung</strong> beschreibt die ersten Züge einer Schachpartie. Sie legt den Grundstein für das weitere Spiel und verfolgt strategische Ziele wie die Entwicklung der Figuren, Kontrolle des Zentrums und sichere Königssicherheit.
                </Paragraph>

                <SectionTitle>Warum sind Eröffnungen wichtig?</SectionTitle>
                <Paragraph>
                    Eine gute Eröffnung bringt deine Figuren schnell ins Spiel, verhindert Schwächen in der Stellung und schafft langfristige Vorteile. Viele Partien werden bereits in den ersten Zügen entschieden – durch unvorsichtige oder planlose Eröffnungen. Deshalb lohnt sich das Studium typischer Eröffnungen und ihrer Ideen.
                </Paragraph>

                <SectionTitle>Ein Blick in die Geschichte</SectionTitle>
                <Paragraph>
                    Bereits im 15. Jahrhundert begannen Schachspieler, bestimmte Zugfolgen zu analysieren. Im 19. Jahrhundert wurden viele klassische Eröffnungen wie das „Spanische Spiel“ oder die „Sizilianische Verteidigung“ systematisiert. Großmeister wie Paul Morphy, Wilhelm Steinitz oder später Garry Kasparov prägten mit ihrem Eröffnungswissen ganze Generationen von Spielern.
                </Paragraph>

                <SectionTitle>Fazit</SectionTitle>
                <Paragraph>
                    Das Verständnis für Eröffnungen verbessert dein gesamtes Schachspiel. Wer die Ideen hinter den Zügen versteht, hat einen entscheidenden Vorteil – nicht nur in den ersten Zügen, sondern im gesamten Spielverlauf.
                </Paragraph>
            </ContentWrapper>
        </PageContainer>
    );
}