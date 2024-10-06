import { EmailTypeEnum, EmailMessageType } from "@/helpers/sendEmail";
import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface EmailComponentProps {
  username: string;
  code: string;
  type: EmailTypeEnum;
  message: EmailMessageType;
}

export default function EmailComponent({
  username,
  code,
  type,
  message,
}: EmailComponentProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your code for {type}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>{message}</Text>
        </Row>
        <Row>
          <Text>{code}</Text>
        </Row>
        <Row>
          <Text>
            If you did not request this code, please ignore this email.
          </Text>
        </Row>
        {/* <Row>
              <Button
                href={`http://localhost:3000/verify/${username}`}
                style={{ color: '#61dafb' }}
              >
                Verify here
              </Button>
            </Row> */}
      </Section>
    </Html>
  );
}
